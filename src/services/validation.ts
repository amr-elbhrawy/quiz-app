export const EMAIL_VALIDATION ={
    required: "email is required",
    pattern: {
        value :/^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim ,
        message :"email is not valid"
    }
  }