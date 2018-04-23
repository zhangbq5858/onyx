// fetch services

// provide services to user like register, login and logout

// id is actually email address

export const requestLogin = async function(Email, password) {
    try{
      console.log("request login", Email, password);
      const response = await fetch('/login',
      {method: "POST",
        body: JSON.stringify({
          Email,
          password,
        })
      });
      console.log("request login", response);
      return response;
    }catch(e){
      return Promise.reject(e);
    }
  }

 export const requestRegister = async function(userInfo){
    try{
        console.log("request register", userInfo);
        const response = await fetch('/register',
        {method: "POST",
          body: JSON.stringify({
            userInfo,
          })
        });
        console.log("request register", response);
        return response;
      }catch(e){
        return Promise.reject(e);
    }
 }

 export const requestAllnotes = async function (owner){
    //console.log("Request all notes",this.state.owner);
    try{ 
      const response = await fetch('/main', {method: "POST", 
      body: JSON.stringify({
        owner,
      })
    });
      return response.ok ? response.json() : Promise.reject(response.statusText);
    }catch(e){
        return Promise.reject(e);
    }
  }

  export const requestUpdate = async function(notes){
    try{ 
      const updateNotes = {};  
      for(let created in notes){
        let updateNote = Object.assign({}, notes[created]);
        delete updateNote.complete;
        updateNotes[created] = updateNote;
      }
      const response = await fetch('/update',
      {method: "PUT", 
        body: JSON.stringify({
          updateNotes,
        })
      });
      return response;
    }catch(e){
      return Promise.reject(e);
    }
  }



