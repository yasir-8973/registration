const defaultStore = {
    PersonalDetails:{},
    CompanyDetails:{},
    BacktoPersonal:false,
    BacktoCompany:false
}
export default function(state = defaultStore, action = {}) {
    switch (action.type) {
        case "PersonalDetails":
            return {
            ...state,
            PersonalDetails:action.PersonalDetails
            }   
        case "CompanyDetails":
            return {
                ...state,
                CompanyDetails:action.CompanyDetails
            }     
        case "BacktoPersonal":
            return {
                ...state,
                BacktoPersonal:action.BacktoPersonal
            }
        case "BacktoCompany":
            return {
                ...state,
                BacktoCompany:action.BacktoCompany
            }
        default:  
            return state;
    }    
}  