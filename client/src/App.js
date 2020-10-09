import React from 'react';
import './App.css';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      showError: false,
      text: "",
      date: "",
      value:"",
      information: []
    };
  }

  
  componentDidMount() {
    this.getInformation();
  }

  getInformation = () => {
    fetch(`/diary`)
      .then(response => response.json())
      .then(response => {
        this.setState({ 
          information: response.map(each => { each.date = new Date(each.date).toDateString(); return each })
        });
      });
  };
  

  handleInput = (event) => {
    this.setState({
      text: event.target.value,
      showError: false
    });
  }

  
  dateAgost = (event) => {
    this.setState({
      date: event.target.value
    });
  }

  
  addDay(){
    
    if(this.state.text === "" || this.state.text === undefined || this.state.date === "" || this.state.date === undefined) {
      this.setState({ showError: true})
    }
    else {
      this.setState({ showError: false})

      fetch("/diary", {
        method: "POST",
        headers: {"Content-Type": "application/json" }, 
        body: JSON.stringify({ text: this.state.text, date: this.state.date })
      }) .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        } else {
          return response.json();
        }
      })
      .then(response => {
        this.setState({
          information: response.map(each => { each.date = new Date(each.date).toDateString(); return each })
        });
         this.setState({
            date: "",
            text: ""
        });
      })
    }
  };

  
  viewText(value) {
    this.setState({
      text: value
    })
    
  }

  deleteDate(id){
    fetch(`/diary/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },
    })
    .then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      } else {
        return response.json();
      }
    })
    .then(response => {
      this.setState({
        information: response.map(each => { each.date = new Date(each.date).toDateString(); return each })
      });
      this.setState({
        date: "",
        text: ""
      });
    })
    
  };


 render () {
   const { text, date, information } = this.state;
  return (
    <div className="container">
      <div className="row">
        <div className="col-3">
          <h2>MY VIRTUAL DIARY</h2>
        </div>
              {/* <div>{text}</div>  */}
        <div className="col-6">
          <textarea
              type="text"
              value={text}
              onChange={this.handleInput}
              placeholder="How was your day?.."
              maxLength="500"
            ></textarea>
       
    
          <div style={{ fontSize: 10, color: "red"}}>
            {this.state.textError}          
          </div>

          <input 
          type="date" 
          value={date} 
          onChange={this.dateAgost} 
          placeholder="00/00/0000" 
          /> 
        
          {this.state.showError ? (<div className="text-danger"><i>All inputs are required</i></div>) : (<div></div>)}
        
          <button onClick={e => this.addDay()} className="btn btn-outline-secondary btn-sm "><b>SAVE IN DATABASE</b></button>
        </div>
     
          <div className="col-3">
            {information.map(each => {
              return (
                <div key={each.id} >
                  <div><button onClick={() => this.viewText(each.text)} className="btn btn-outline-secondary btn-sm">
                    {each.date}
                  </button></div>
                  <button onClick={() => this.deleteDate(each.id)} className="btn"><i class="far fa-trash-alt"></i>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>
       

  );
 };
};


export default App;
