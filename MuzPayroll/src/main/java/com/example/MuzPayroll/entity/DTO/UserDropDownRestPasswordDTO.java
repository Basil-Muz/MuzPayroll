package com.example.MuzPayroll.entity.DTO;

public class UserDropDownRestPasswordDTO {
    private String userCode;
    private String username;
   

    public UserDropDownRestPasswordDTO(String userCode, String username) {
        this.userCode = userCode;
        this.username = username;
    }

    public String getUserCode() {
        return userCode;
    }

    public String getUsername() {
        return username;
    }

   
  

}
