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
    <div className="container-fluid p-4 m-3">
      <div className="row">

        <div className="col mt-1 mr-4 ml-4" id="textcontainer">
          <div className="container mt-4">{text}</div>
        </div> 

        <div className="col text-center d-flex justify-content-center align-items-center" id="container">
          <div className="container text-center">
            <h2 className="mb-2" id="h2">MY VIRTUAL DIARY</h2> 
            <textarea
              type="text"
              value={text}
              onChange={this.handleInput}
              placeholder="How was your day?.."
              maxLength="500"
              className="form-control mt-4"
              cols="40" 
              rows="5"
              id="placeholder"
            ></textarea>
            <div className="text-danger mb-4">
              {this.state.textError}          
            </div>
            <input 
              type="date" 
              value={date} 
              onChange={this.dateAgost} 
              placeholder="00/00/0000" 
              className="mb-4"
            /> 
          
              {this.state.showError ? (<div className="text-danger mb-4"><i>All inputs are required</i></div>) : (<div></div>)}
          
            <button onClick={e => this.addDay()} className="btn btn-outline-secondary btn-sm mb-2" id="buttonsave"><b>SAVE IN DATABASE</b></button>
            </div>
            </div>
           
            <div className="row">
              <footer id="footer">
                <div className="container mt-4 pt-4">
                  {information.map(each => {
                    return (
                      <div key={each.id} >
                        <div>
                          <button onClick={() => this.viewText(each.text)} className="btn btn-outline-secondary btn-sm mb-2 ml-4">
                          {each.date}
                          </button>
                  
                          <button onClick={() => this.deleteDate(each.id)} className="btn mb-2"><i class="far fa-trash-alt"></i>
                          </button>
                        </div>
                      </div>
                        );
                      })} 
                </div>
              </footer>
            </div>
          
          
      </div>
    </div>
    
       

  );
 };
};


export default App;
