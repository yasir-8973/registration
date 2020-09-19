import React , {useState,useEffect} from 'react';
// Redux Imports
import { useDispatch, useSelector } from "react-redux";

import ImageUpload from './ImageUpload';
import TextField from '@material-ui/core/TextField';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Alert from '@material-ui/lab/Alert';
import Button from '@material-ui/core/Button';
import '../css/image.css';

export default function CompanyDetails(props){
	const content = useSelector(state => state);
    const dispatch = useDispatch();

	const [ProfileImg,setProfileImg]=useState("");
    const [ProfileImgVal,setProfileImgVal]=useState(""); 
    const [ImageAlert,setImageAlert]=useState(""); 

    const [CompanyName,setCompanyName] = useState("");
    const [Email,setEmail] = useState("");
    const [EmailText,setEmailText] = useState("");
    const [JobTitle,setJobTitle] = useState("");
    const [Year,setYear] = useState("");
    const [Checked, setChecked] = useState(false);
    const [loading,setLoading] = useState({type:false,msg:""});

	useEffect(() => {
		dispatch({
			type:"BacktoCompany",
			BacktoCompany:false
		})
	},[])

    function ImageChange(url){          
      setProfileImgVal(url);
    } 
    function ImageMessage(val){
      setImageAlert(val);
    } 

    function OnBack(){
    	dispatch({
    		type:"BacktoPersonal",
    		BacktoPersonal:true
    	})
    } 
    function OnChange(){ 
    	setLoading({type:true,msg:"Loading..."});
    	let otp = Math.floor(1000 + Math.random() * 9000);		
		const data = {
			from : "mohammedyaseer1771@gmail.com",
			to : Email,
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
				dispatch({
					type:"CompanyDetails",
					CompanyDetails:{
						CompanyProfile:ProfileImgVal,
						CompanyName:CompanyName,
						Email:Email,
						JobTitle:JobTitle,
						Year:Year,
						Checked:Checked,
						OTP:otp,
						Step2:true
					}
				});				
			}
			setLoading({type:false,msg:data.msg});
		})
		.catch((error) => {
		  console.error('Error:', error);
		  setLoading(false);
		});
	}
	function validateEmail(email){
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

        if (reg.test(email) == false){
        	setEmail(email);
            setEmailText('Invalid Email Address');
        }else{
        	setEmail(email);
        	setEmailText('');
        }
	}

	useEffect(() => {
		if(content.BacktoCompany){
			if(content.CompanyDetails.CompanyProfile){
				setProfileImg(content.CompanyDetails.CompanyProfile);	
			}
			setProfileImgVal(content.CompanyDetails.CompanyProfile);
			setCompanyName(content.CompanyDetails.CompanyName);
			setEmail(content.CompanyDetails.Email);
			setJobTitle(content.CompanyDetails.JobTitle);
			setYear(content.CompanyDetails.Year);
			setChecked(content.CompanyDetails.Checked);
		}		
	},[content.BacktoCompany]);

	useEffect(() => {
  	if(content.PersonalDetails.Step1){ 
  		if(content.CompanyDetails.CompanyProfile){
			setProfileImg(content.CompanyDetails.CompanyProfile);	
		}
		setProfileImgVal(content.CompanyDetails.CompanyProfile);
		setCompanyName(content.CompanyDetails.CompanyName);
		setEmail(content.CompanyDetails.Email);
		setJobTitle(content.CompanyDetails.JobTitle);
		setYear(content.CompanyDetails.Year);
		setChecked(content.CompanyDetails.Checked);	
  	}

  },[content.PersonalDetails]);

    return (
	    <div className="width100 textAlignCenter displayGrid">
		    	<h2 className="hTag">Add your Company Details</h2>
		    	<h4 className="hTag">Please fill the below Items</h4>
		    	{loading.type && <Alert severity="warning">{loading.msg}</Alert>}		    	
		    	<div className="center">
		    		<ImageUpload 
			            value={ProfileImg}
			            onChange={(url,name) => {ImageChange(url,name)}} 
			            message={ImageMessage} 
			            id="LogoImg" 			          
			        />
			        {ImageAlert && <Alert severity="error">{ImageAlert}</Alert>}
				</div>
				<div className="textAlignCenter displayGrid">
		    		<TextField className="center" label="Company Name" variant="outlined"
		    			value={CompanyName} onChange={(e) => {setCompanyName(e.target.value);}}		    			
		    		/>
		    		<TextField className="center" label="Email id" variant="outlined" helperText={EmailText}
		    			value={Email} onChange={(e) => {validateEmail(e.target.value);}} error={EmailText && "error"}
		    		/>
		    		<TextField className="center" label="Job Title" variant="outlined"
		    			value={JobTitle} onChange={(e) => {setJobTitle(e.target.value);}}
		    		/>
		    		<TextField style={{marginTop :10}} label="Years of Experience" className="center"
				    	type="number" variant="outlined" value={Year} 
				    	onChange={(e) => {setYear(Math.max(0, parseInt(e.target.value) ).toString().slice(0,2));}}
			        />
			        <FormControlLabel className="center"
			            control={<Checkbox color="primary" checked={Checked} onChange={(e)=> setChecked(e.target.checked)} />}
			            label="I accept the terms & conditions"
			        />
			        <div className="displayFlex width100">
				        <Button variant="contained" color="primary" className="width50" onClick={OnBack}>
		                    Back
		              	</Button>
		              	<Button variant="contained" className="width50" color="primary"
		              		disabled={((ProfileImgVal || ProfileImg) && CompanyName && Email && !EmailText && Year && JobTitle && Checked) ? 
		              			false : true  }  onClick={OnChange}>
			            	Send OTP
			            </Button>
			        </div>
		    	</div>
		    	
	    </div>
	)
}