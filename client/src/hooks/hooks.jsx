import { useEffect,useState } from "react"
import toast from "react-hot-toast";
import { NEW_MESSAGE } from "../constants/events";


const useErrors = (errors=[])=>{
    useEffect(()=>{

        errors.forEach(({isError,error,fallback})=>{
             if(isError){
                if(fallback) fallback();
                else toast.error(error?.data?.message || "Something went wrong")
             }
        })

    },[errors])
}

const useAsyncMutation = (mutationHook)=>{
    const [isLoading,setIsLoading] = useState(false)
    const [data,setData] = useState(null)

    const [mutate] = mutationHook();
    
    const executeMutation = async (toastMessage,...args) => {
        setIsLoading(true)
        const toastId = toast.loading(toastMessage || "updating data...")
       try {
             const res = await mutate(...args)
             if(res.data){
               toast.success(res.data.message||"Friend Request Sent",{id:toastId})
               setData(res.data)
             }else{
               toast.error(res?.error?.data?.message || "Something went wrong",{id:toastId})
             }
           } catch (error) {
             toast.error("Something went wrong",{id:toastId})
           }finally{
            setIsLoading(false)
        }
    }

    return [executeMutation,isLoading,data]
}

const useSocketEvents = (socket,handlers)=>{
  console.log("Attaching socketes",Object.keys(handlers))
 useEffect(()=>{
  Object.entries(handlers).forEach(([event,handler])=>{
    socket.on(event,handler)
  });

  return () => {
    Object.entries(handlers).forEach(([event,handler])=>{
      socket.off(event,handler)
    });
  };
 },[socket,handlers])
}
const useCustomFetch = (url) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(url, {
      credentials: "include", // ✅ needed for auth cookies
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, [url]);

  return { data, loading, error };
};

export {useErrors,useAsyncMutation,useSocketEvents,useCustomFetch}