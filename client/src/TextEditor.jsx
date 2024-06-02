import Quill from 'quill'
import 'quill/dist/quill.snow.css'
import { useCallback,useEffect,useState } from 'react'
import { useParams } from 'react-router-dom'
import {io} from 'socket.io-client'
import ProtectedMiddleware from './protected'
const toolbarOptions = [
    ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
    ['blockquote', 'code-block'],
    ['link', 'image', 'video', 'formula'],
  
    [{ 'header': 1 }, { 'header': 2 },{ 'header': 3 },{ 'header': 4 }],               // custom button values
    [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
    [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
    [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
    [{ 'direction': 'rtl' }],                         // text direction
  
    [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
    [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
    [{ 'font': [] }],
    [{ 'align': [] }],
  
    ['clean']                                         // remove formatting button
  ];
  const SAVE_INTERVAL_MS = 2000;

const TextEditor = () => {
    const [socket, setsocket] = useState(null)
    const [quill, setquill] = useState(null)
    const [password, setpassword] = useState('')
    const [canSeeDoc, setcanSeeDoc] = useState(false)
    const {id:documentId}= useParams()
   
    //connect with soketio
    useEffect(() => {
        const s = io('http://localhost:5174')   

        setsocket(prev=>prev=s)    
        return ()=>{
            s.disconnect()
        }
    },[])
    //saving each saveintervalms
    useEffect(()=>{
        if(socket == null || quill==null) return
        const interval = setInterval(()=>{
            socket.emit('save-document',quill.getContents())
        },SAVE_INTERVAL_MS)

        return ()=>{
            clearInterval(interval)
        }
    },[socket,quill])
    //loading and setting document
    useEffect(()=>{
        if(socket == null || quill==null) return
        socket.once('load-document',document=>{
            quill.setContents(document)
            quill.enable()
        })
        socket.emit('get-document',documentId)
    },[socket,quill,documentId])

    //update document 
    useEffect(()=>{
        if(socket == null || quill==null) return
        const handler = (delta)=>{
            quill.updateContents(delta)
        }
        socket.on('receive-changes',handler)
        return ()=>{
            socket.off('receive-changes',handler)
        }
    },[socket,quill])
    useEffect(()=>{
        if(socket == null || quill==null) return
        const handler = (delta,olddelta,source)=>{
            if(source!='user') return
            socket.emit('send-changes',delta)
        }
        quill.on('text-change',handler)
        return ()=>{
            quill.off('text-change',handler)
        }
    },[socket,quill])

    const wrapperRef = useCallback((wrapper)=>{
        const editor = document.createElement('div')
        if (wrapper==null) return
        wrapper.innerHTML = ''
        wrapper.append(editor)
        const q = new Quill(editor,{theme:'snow',modules:{toolbar:
            toolbarOptions}
        })
        q.disable()
        q.setText('Loading...')
        setquill(q)
    },[])
  return (
    <div id='container' ref={wrapperRef}></div>
  )
}

export default TextEditor
