import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

export default function Contact({eventListing}) {
    const [agentDetails, setAgentDetails] = useState(null);
    const [message, setMessage] = useState('');
    const onChange = (e) => {
        setMessage(e.target.value);
    };
    useEffect(()=>{
      const fetchAgentDetails = async () => {
        try {
            const res = await fetch(`/api/user/${eventListing.userRef}`);
            const data = await res.json();
            setAgentDetails(data);
            console.log(agentDetails);
        } catch(error) {
            console.log(error);
        }
      };
      fetchAgentDetails();
    }, [eventListing.userRef])
  return (
    <>
     {agentDetails && (
        <div className='flex flex-col gap-2'>
            <p>
                Contact <span className='font-semibold'>{agentDetails.username}</span>{' '}
                for:{' '}
                <span className='font-semibold'>{eventListing.name}</span>
            </p>
            <textarea
                name='message'
                id='message'
                rows='2'
                value={message}
                onChange={onChange}
                placeholder='Enter your message here...'
                className='w-full border p-3 rounded-lg'
            ></textarea>

            <Link
                to={`mailto:${agentDetails.email} ${eventListing.name}&body=${message}`}
                className='bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95'
            >
                Send Message
            </Link>
        </div>
     )}
    </>
  );
}
