import db, {auth, provider,storage} from '../firebase'
import { signInWithPopup, signOut } from 'firebase/auth';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { collection, addDoc, setDoc, doc, onSnapshot } from "firebase/firestore";
import { SET_USER, SET_LOADING_STATUS, GET_ARTICLES } from "../actions/actionType";
import { async } from '@firebase/util';

export const setUser = (payload) => ({
    type:SET_USER,
    user: payload,
})
export const setLoading = (status) => ({
    type: SET_LOADING_STATUS,
    status: status
})
export const getArticles = (payload) => ({
    type: GET_ARTICLES,
    payload: payload
})

export function signInAPI() {
    return (dispatch) => {
        signInWithPopup(auth, provider).then((payload) => {
            dispatch(setUser(payload.user));

        }).catch((error) => alert(error.message));
            
    };
}

export function getUserAuth() {
    return (dispatch) => {
        auth.onAuthStateChanged(async(user) => {
            if(user){
                dispatch(setUser(user));
            }
        })
    }
}

export function signOutAPI() {
    return (dispatch) =>{
        signOut(auth).then(()=> {
            dispatch(setUser(null));
        }).catch((error) => {
            console.log(error.message)
        });
    }
}

export function postArticleAPI(payload){
    const metadata = { contentType: 'image/jpeg' }
    const storageRef = ref(storage, 'images/' + payload.image.name);
    const uploadTask = uploadBytesResumable(storageRef, payload.image, metadata);
    return (dispatch) =>{
        dispatch(setLoading(true))

        if (payload.image !== ''){
          const upload = storage
          uploadTask.on('state_changed', (snapshot) => {
            const progress = (
                (snapshot.bytesTransferred / snapshot.totalBytes) *100);    

            console.log(`Progress: ${progress}%`);
            
            if (snapshot.state === 'RUNNING'){
                console.log(`Progress: ${progress}%`);
            }
          }, (error) => console.log(error.code),
         () => {
              getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL)=>{
                  console.log('File available at', downloadURL);

                  var currentdate = new Date();
                  var datetime = "time" + currentdate.getDate()
                            + (currentdate.getMonth() + 1)
                            + currentdate.getFullYear()
                            + currentdate.getHours()
                            + currentdate.getMinutes()
                            + currentdate.getSeconds();
              
              const docRef = await addDoc(collection(db,"articles"),{

                  additionalTime: datetime,
                  video: payload.video,
                  sharedImg: downloadURL,
                  comments : 0,
                  description:payload.description,

                  actor: {
                      description: payload.user.email,
                      title: payload.user.displayName,
                      date:Date.now(),
                      image: payload.user.photoURL
                  }
                  
              });
               dispatch(setLoading(false));
               console.log("Document written with ID: ", docRef.id);
         });
    });}
        else if (payload.video){

            var currentdate = new Date();
            var datetime = "time" + currentdate.getDate()
                + (currentdate.getMonth() + 1)
                + currentdate.getFullYear()
                + currentdate.getHours()
                + currentdate.getMinutes()
                + currentdate.getSeconds();
                
            const docData = {
                video: payload.video,
                sharedImg: "",
                comments: 0,
                description: payload.description,

                actor: {
                    description: payload.user.email,
                    title: payload.user.displayName,
                    date: Date.now(),
                    image: payload.user.photoURL
                }
            }
            setDoc(doc(db, "articles", `${payload.user.uid}${datetime}`), docData);
            dispatch(setLoading(false))
            } 
        }
    
}
export function getArticlesApi() {
    return async (dispatch) => {

        onSnapshot(collection(db, 'articles'), (snapshot) => {
            let payload = snapshot.docs.map((doc) => {
                return { id: doc.id, ...doc.data() }

            })

            dispatch(getArticles(payload.sort((a, b) => (a.actor.date < b.actor.date) ? 1 : -1)))
        })

    }
}

