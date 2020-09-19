import React, {useState,useEffect} from 'react';
import './css/App.css'
import { makeStyles } from '@material-ui/core/styles';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepButton from '@material-ui/core/StepButton';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

// Components
import PersonalDetails from './components/PersonalDetails';
import CompanyDetails from './components/CompanyDetails';
import EmailVerification from './components/EmailVerification';
// Redux Imports
import { useDispatch, useSelector } from "react-redux";



const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
  },
  button: {
    marginRight: theme.spacing(1),
  },
  completed: {
    display: 'inline-block',
  },
  instructions: {
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
}));

function getSteps() {
  return ['Personal Details', 'Company Details', 'Email Verification'];
}



function getStepContent(step) {
  switch (step) {
    case 0:
      return <PersonalDetails />;
    case 1:
      return <CompanyDetails />;
    case 2:
      return <EmailVerification />;
    default:
      return 'Unknown step';
  }
}
export default function Registration() {
  const classes = useStyles();
  const content = useSelector(state => state);
  const dispatch = useDispatch();	
  const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState({});
  const steps = getSteps();

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const isLastStep = () => {
    return activeStep === totalSteps() - 1;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleNext = () => {
    const newActiveStep =
      isLastStep() && !allStepsCompleted()
        ? // It's the last step, but not all steps have been completed,
          // find the first step that has been completed
          steps.findIndex((step, i) => !(i in completed))
        : activeStep + 1;
    setActiveStep(newActiveStep);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleStep = (step) => () => {
    // setActiveStep(step);
  };

  // const handleComplete = () => {  	
  //   const newCompleted = completed;
  //   newCompleted[activeStep] = true;
  //   setCompleted(newCompleted);
  //   handleNext();
  // };

  const handleReset = () => {
    setActiveStep(0);
    setCompleted({});
  };

  useEffect(() => {
  	if(content.PersonalDetails.Step1){ 
  		const newCompleted = completed;
	    newCompleted[activeStep] = true;
	    setCompleted(newCompleted);
	    handleNext();
  	}

  },[content.PersonalDetails]);

  useEffect(() => {
    if(content.CompanyDetails.Step2){ 
      const newCompleted = completed;
      newCompleted[activeStep] = true;
      setCompleted(newCompleted);
      handleNext();
    }

  },[content.CompanyDetails]);
  
  useEffect(() => {
    if(content.BacktoPersonal){
      setActiveStep(0);
    }
  },[content.BacktoPersonal]);

  useEffect(() => {
    if(content.BacktoCompany){
      setActiveStep(1);
    }
  },[content.BacktoCompany]);

  


  return (
    <div className={classes.root}>
      <Stepper nonLinear activeStep={activeStep}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton onClick={handleStep(index)} completed={completed[index]}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <div>
        {allStepsCompleted() ? (
          <div>
            <Typography className={classes.instructions}>
              All steps completed - you&apos;re finished
            </Typography>
            <Button onClick={handleReset}>Reset</Button>
          </div>
        ) : (
          <div>
            <Typography className={classes.instructions}>{getStepContent(activeStep)}</Typography>
            <div>              
              {activeStep !== steps.length &&
                (completed[activeStep] ? (
                  <Typography variant="caption" className={classes.completed}>
                    Step {activeStep + 1} already completed
                  </Typography>
                ) : (null
                  // <Button variant="contained" color="primary" onClick={handleComplete}>
                  //   {completedSteps() === totalSteps() - 1 ? 'Finish' : 'Complete Step'}
                  // </Button>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
