import React , {useState,useEffect} from 'react';
// Redux Imports
import { useDispatch, useSelector } from "react-redux";
import Button from '@material-ui/core/Button';
import OtpInput from 'react-otp-input';
import Alert from '@material-ui/lab/Alert';

export default function EmailVerification(props){
	const content = useSelector(state => state);
    const dispatch = useDispatch();
    const [otp,setOtp] = useState("");
    const [msg,setMsg] = useState("");
    const [status,setStatus] = useState("");
    useEffect(() => {
		dispatch({
			type:"BacktoCompany",
			BacktoCompany:false
		})
	},[]);

	function OnBack(){
    	dispatch({
    		type:"BacktoCompany",
    		BacktoCompany:true
    	})
    } 
    const handleChange = otp => {
    	setMsg("");
    	setOtp(otp)
    };
    function CheckOtp(){
    	if(content.CompanyDetails.OTP === parseInt(otp)){
			setMsg("Email verified successfully");
			setOtp("");
			setStatus("success");
			dispatch({
				type:"ProcessCompleted",
				ProcessCompleted:true
			})
    	}else{
    		setMsg("Wrong OTP please try again.");
			setOtp("");
			setStatus("error");
    	}
    }
    const Resend = () =>{
    	setMsg("");
    	let otp = Math.floor(1000 + Math.random() * 9000);		
		const data = {
			from : "mohammedyaseer1771@gmail.com",
			to : content.CompanyDetails.Email,
			subject : "Hi please verify youe Email",
			text : "your OTP for Email verification is ("+otp+")"
		};

		fetch('http://localhost:5000/sendMail/', {
		  	method: 'POST',
		  	headers: {
		      'Content-Type': 'application/json'
		    },
		  	body: JSON.stringify(data),
		})
		.then(response => response.json())
		.then(data => {
			if(data.success){
				setMsg("OTP sended successfully");	
				setStatus("success");
			}
		})
		.catch((error) => {
		  console.error('Error:', error);
	  	});
    }

  	return (
    	<div className="width100 textAlignCenter displayGrid">
		    	<h2 className="hTag">Enter your OTP</h2>
		    	<h4 className="hTag">For your security we need to verify your Email.
		    		We send a 4-digit code to {content.CompanyDetails.Email}.please enter it below.</h4>	
		    	<div className="textAlignCenter displayGrid">
		    		<div className="center">
		    			<p className="Code">Enter your Code</p>
		    			<div className="OTPDiv">
			    			<OtpInput
						        value={otp}
						        onChange={handleChange}
						        numInputs={4}
						        separator={<span>-</span>}
						    />	
						</div>
		    		</div>		    		
		    		<div className="displayFlex width100">				        	              
		              	{msg ?  
		              		status == "success"  ?
		              			<div>
					              	<Button variant="contained" color="primary" className="nextButton margin5" onClick={() => window.location.reload(false)}>
					                     Back to Home
					              	</Button>
				              	</div>
		              		:
		              			<div>
			              			<Button variant="contained" color="primary" className="width50 backButton margin5" onClick={Resend}>
					                    Resend OTP
					              	</Button>	
			              			<Button disabled={otp.toString().length == 4 ? false : true} variant="contained" 
			              				color="primary" className="width50 nextButton margin5" onClick={CheckOtp}>
					                    Verify
					              	</Button>
				              	</div>
	              		:
	              			<div>
	              			<Button variant="contained" color="primary" className="width50 backButton margin5" onClick={OnBack}>
			                    Back
			              	</Button>	
	              			<Button disabled={otp.toString().length == 4 ? false : true} variant="contained" 
	              				color="primary" className="width50 nextButton margin5" onClick={CheckOtp} >
			                    Verify
			              	</Button>
			              	</div>
		              	}		              	
			        </div>
			        <p className="desc">Didn't receive Mail? Check &nbsp;
			        	<a target="_black" href="https://myaccount.google.com/lesssecureapps">myaccount.google.com/lesssecureapps</a> 
			        		&nbsp; before sending OTP from {content.CompanyDetails.Email}. </p>
			        {msg && <Alert severity={status}>{msg}</Alert>}		    	
		    	</div>
    	</div>
  	)
}