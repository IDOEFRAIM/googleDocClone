import { useState } from "react"
const protectedMiddleware = ({password,setpassword,setcanSeeDoc}) => {
  const [error, seterror] = useState(false)
  const submit = e=>{
  
  }
  return (
    <form >
      <input type="text" 
      placeholder="set your password"
      onChange={e=>setpassword(e.target.value)}/>
      <button onSubmit={submit}>Submit</button>
      {error && <p>Le mot de passe est obligatoire pour voir ce document</p>}
    </form>
  )
}

export default protectedMiddleware
