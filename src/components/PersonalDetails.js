import React , {useState,useEffect} from 'react';
// Redux Imports
import { useDispatch, useSelector } from "react-redux";
// Dummy Json for selecting Country & States
import Country from '../json/Country.json';
import Phone from '../json/Phone.json';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import Grid from '@material-ui/core/Grid';
import Autocomplete from '@material-ui/lab/Autocomplete';
import Alert from '@material-ui/lab/Alert';

export default function PersonalDetails(){	
	const content = useSelector(state => state);
    const dispatch = useDispatch();

	const [FullName,setFullName] = useState("");
	const [FullNameText,setFullNameText] = useState("");
	const [CountryData,setCountryData] = useState(Country.countries); 
	const [CountryName,setCountryName] = useState(""); 
	const [CountryInputValue, setCountryInputValue] = useState('');
	const [CountryNameText,setCountryNameText] = useState("");
	const [StateData,setStateData] = useState([]);
	const [StateName,setStateName] = useState("");
	const [StateInputValue, setStateInputValue] = useState('');
	const [StateNameText,setStateNameText] = useState("");
	const [PhoneNumber,setPhoneNumber] = useState("");
	const [PhoneNumberText,setPhoneNumberText] = useState("");
	const [Gender,setGender] = useState("");
	const [ShowAlert,setShowAlert]= useState(false);

	useEffect(() => {
		dispatch({
			type:"BacktoPersonal",
			BacktoPersonal:false
		})
	},[])

	function CountryChange(val){
		if(val){
			setStateData(val.states);
			setStateName("");
			setStateInputValue("");
			setCountryName(val.country);
			setCountryInputValue(val.country);
			setCountryNameText("");
			Phone.map((items) => {
				if(items.name == val.country){
					setPhoneNumber(parseInt(items.dial_code));
				}
			})
		}		
	}

	function OnChange(){
		if(!FullName){
			setFullNameText("Full Name is Required");
			return false; 
		}
		if(!CountryName && !CountryInputValue){
			setCountryNameText("Country is Required");
			return false; 	
		}
		if(!StateName && !StateInputValue){
			setStateNameText("State is Required");
			return false; 	
		}		
		if((PhoneNumber).toString().length < 4){			
			setPhoneNumberText("Phone Number is Required");
			return false; 	
		}
		if(!Gender){
			setShowAlert(true);
			setTimeout(function(){ setShowAlert(false); }, 3000);
			return false; 	
		}
		dispatch({
			type:"PersonalDetails",
			PersonalDetails:{
				FullName:FullName,
				CountryName:CountryName ? CountryName : CountryInputValue ,
				StateName:StateName ? StateName : StateInputValue,
				PhoneNumber:PhoneNumber,
				Gender:Gender,
				Step1:true
			}
		});
		
	}
	function GenderType(type){
		var elems = document.querySelectorAll(".Buttons");
        [].forEach.call(elems, function(el) {
          el.classList.remove("ButtonActive");
        });
        setGender(type);
        if(type == "Male"){             
	        document.getElementById("Male").classList.add("ButtonActive");        
        }else if(type == "Female"){             
            document.getElementById("Female").classList.add("ButtonActive");
        }else if(type == "Other"){
        	document.getElementById("Other").classList.add("ButtonActive");
        }
    }
    useEffect(() => {
	    if(content.BacktoPersonal){
	      setFullName(content.PersonalDetails.FullName);
	      setCountryInputValue(content.PersonalDetails.CountryName);
	      setStateInputValue(content.PersonalDetails.StateName);
	      setPhoneNumber(content.PersonalDetails.PhoneNumber);
	      GenderType(content.PersonalDetails.Gender);

	    }
	},[content.BacktoPersonal]);


	return (
	    <div className="width100 textAlignCenter displayGrid">
	    	<h2 className="hTag">Add your Personal Details</h2>
	    	<h4 className="hTag">Please fill the below Items</h4>
	    	<div className="textAlignCenter">
	    		<TextField className="center" label="Full Name" variant="outlined"  helperText={FullNameText}
	    			value={FullName} onChange={(e) => {setFullName(e.target.value);setFullNameText("")}}
	    			error={FullNameText && "error"}
	    		/>
    				    		
			    <Autocomplete
			    	className="center marginTop" inputValue={CountryInputValue} onInputChange={(e, val) => {
			          setCountryInputValue(val); }} onChange={(e,val) => {CountryChange(val)}}
				    options={CountryData} getOptionLabel={(option) => option.country}
				    renderInput={(params) => <TextField {...params} value={CountryName} label="Country" variant="outlined" 
			    		helperText={CountryNameText} error={CountryNameText && "error"}
			    	/>}
			    />
			    <Autocomplete
			    	className="center marginTop" inputValue={StateInputValue} onInputChange={(e, val) => {
			          setStateInputValue(val); }} onChange={(e,val) => {setStateName(val);setStateNameText("")}}
		    		disabled={!CountryName && true}			    	
				    options={StateData}
				    getOptionLabel={(option) => option}
				    renderInput={(params) => <TextField {...params} value={StateName} label="State" variant="outlined" 
				    	helperText={StateNameText} error={StateNameText && "error"}
				    />}
			    />
			    <TextField style={{marginTop :10}} label="Phone Number" className="center" helperText={PhoneNumberText}
			    	type="number" variant="outlined" disabled={!CountryName && true} error={PhoneNumberText && "error"}
			    	value={PhoneNumber} onChange={(e) => {setPhoneNumber(e.target.value);setPhoneNumberText("")}}
		        />
		        <div className="center">
		    		<h5 className="textAlignLeft hTag">Gender</h5>
		            <ButtonGroup color="primary">
					        <Button id="Male" className="Buttons"
					        	onClick={()=> {GenderType('Male')}}>Male</Button>
					        <Button id="Female" className="Buttons"
					        onClick={()=> {GenderType('Female')}}>Female</Button>
					        <Button id="Other" className="Buttons"
					        onClick={()=> {GenderType('Other')}}>Other</Button>
			     	</ButtonGroup>
			    </div>
	            {ShowAlert && <Alert className="center" severity="error">Gender is Required</Alert>}
			    <Button variant="contained" color="primary" className="center marginTop" onClick={OnChange}>
                    Next
              </Button>
	    	</div>	    	
		</div>
	)	
}
