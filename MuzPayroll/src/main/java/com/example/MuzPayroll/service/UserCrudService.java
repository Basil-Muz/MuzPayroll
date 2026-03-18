package com.example.MuzPayroll.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.MuzPayroll.entity.UserMst;
import com.example.MuzPayroll.entity.UserTypeMst;
import com.example.MuzPayroll.entity.DTO.Response;
import com.example.MuzPayroll.entity.DTO.UserDTO;
import com.example.MuzPayroll.entity.DTO.UserDropDownRestPasswordDTO;
import com.example.MuzPayroll.repository.UserRepository;

@Service
public class UserCrudService extends MuzirisAbstractService<UserDTO, UserMst> {

    @Autowired
    private UserRepository userRepo;

    @Override
    public Response<Boolean> entityValidate(List<UserDTO> dtos, String mode) {
        UserDTO dto = dtos.get(0);
        List<String> errors = new ArrayList<>();
        if (dto.getUserCode() == null || dto.getUserCode().isEmpty()) {
            errors.add("User code is required");
        }
        if (dto.getUserName() == null || dto.getUserName().isEmpty()) {
            errors.add("User name is required");
        }
        if (dto.getEmail() == null || dto.getEmail().isEmpty()) {
            errors.add("Email is required");
        } else {
            String emailRegex = "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$";
            if (!dto.getEmail().matches(emailRegex)) {
                errors.add("Invalid email format");
            }
        }
        if (dto.getMobileNo() == null || dto.getMobileNo().isEmpty()) {
            errors.add("Mobile number is required");
        } else {
            String mobileRegex = "^[0-9]{10}$";
            if (!dto.getMobileNo().matches(mobileRegex)) {
                errors.add("Invalid mobile number format");
            }
        }
        if (dto.getPassword() == null || dto.getPassword().isEmpty()) {
            errors.add("Password is required");
        } else {
            if (dto.getPassword().length() <= 5) {
                errors.add("Password must be at least 5 characters long");
            }
            String passwordRegex = "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@./#\\-$_%:*&,])[A-Za-z\\d@./#\\-$_%:*&,]{5,}$";
            if (!dto.getPassword().matches(passwordRegex)) {
                errors.add("Invalid password format");
            }
        }
        if (dto.getUserTypeId() == null) {
            errors.add("User type is required");
        }
        if (dto.getChangePasswordNextLogin() == null) {
            errors.add("Change password next login is required");
        }
        if (dto.getAuthorizationStatus() == null) {
            errors.add("Authorization status is required");
        }
        if (dto.getActiveYN() == null) {
            errors.add("Active status is required");
        }
        if (dto.getActiveDate() == null) {
            errors.add("Active date is required");
        }
        if (!errors.isEmpty()) {
            return Response.error(errors, 400);
        }
        return Response.success(true);
    }

    @Override
    public Response<Boolean> entityPopulate(List<UserDTO> dtos, String mode) {
        return Response.success(true);
    }

    @Override
    public Response<Boolean> businessValidate(List<UserDTO> dtos, String mode) {
        return Response.success(true);
    }

    @Override
    public Response<Object> generatePK(List<UserDTO> dtos, String mode) {
        UserDTO dto = dtos.get(0);
        if (dto.getUserMstId() == null) {
            Long id = System.currentTimeMillis();
            dto.setUserMstId(id);

        }
        return Response.success(dto.getUserMstId());
    }

    @Override
    public Response<String> generateSerialNo(List<UserDTO> dtos, String mode) {
        return Response.success("USER");

    }

    @Override
    public Response<UserMst> converttoEntity(List<UserDTO> dtos) {

        UserDTO dto = dtos.get(0);

        UserMst user;

        if (dto.getUserMstId() != null) {
            user = userRepo.findById(dto.getUserMstId()).orElse(new UserMst());
        } else {
            user = new UserMst();
        }

        user.setUserMstID(dto.getUserMstId());
        user.setUserCode(dto.getUserCode());
        user.setUserName(dto.getUserName());
        user.setEmail(dto.getEmail());
        user.setPhoneNumber(dto.getMobileNo());
        user.setPassword(dto.getPassword());

        user.setUserAttempt(0);

        user.setUsmActiveYN(dto.getActiveYN());
        user.setUsmActiveDate(dto.getActiveDate());

        user.setUsmTransValidYN(true);

        user.setUsmAuthInfoID(dto.getAuthorizationStatus());

        user.setUsmPasswordLastChangedDate(LocalDate.now());

        user.setUsmChangePasswordOnNextLogin(dto.getChangePasswordNextLogin());

        // If entity has active date column
        // user.setUsmActiveDate(dto.getActiveDate());

        user.setUsmEntityHierarchyID(null);
        user.setUsmDefaultEntityHierarchyID(null);

        UserTypeMst userType = new UserTypeMst();
        userType.setUgmUserGroupID(dto.getUserTypeId());

        user.setUserTypeMst(userType);

        return Response.success(user);
    }

    @Override
    public UserMst saveEntity(UserMst entity, List<UserDTO> dtos, String mode) {
        return userRepo.save(entity);
    }

    public UserDTO entityToDto(UserMst entity) {

        UserDTO dto = new UserDTO();

        dto.setUserMstId(entity.getUserMstID());
        dto.setUserCode(entity.getUserCode());
        dto.setUserName(entity.getUserName());
        dto.setEmail(entity.getEmail());
        dto.setMobileNo(entity.getPhoneNumber());
        dto.setPassword(entity.getPassword());

        if (entity.getUserTypeMst() != null) {
            dto.setUserTypeId(entity.getUserTypeMst().getUgmUserGroupID());
        }

        dto.setChangePasswordNextLogin(entity.getUsmChangePasswordOnNextLogin());

        dto.setActiveYN(entity.getUsmActiveYN());

        dto.setAuthorizationStatus(entity.getUsmAuthInfoID());

        // if entity has active date
        dto.setActiveDate(entity.getUsmActiveDate());

        return dto;
    }

    public List<UserDTO> getUserList(Long companyId, Boolean activeStatusYN) {
        List<UserMst> users = userRepo.findAllUsers();
        List<UserDTO> result = new ArrayList<>();
        for (UserMst user : users) {
            result.add(entityToDto(user));
        }
        return result;
    }

    public UserDTO getUserById(Long userId) {
        UserMst user = userRepo.findByUserMstId(userId);
        if (user == null) {
            return null;
        }
        return entityToDto(user);
    }

    public List<UserDTO> searchUsers(String search) {
        List<UserMst> users = userRepo.searchUsers(search);
        List<UserDTO> result = new ArrayList<>();
        for (UserMst user : users) {
            result.add(entityToDto(user));
        }
        return result;
    }

    public List<UserDropDownRestPasswordDTO> getUserDropdown() {
        return userRepo.getUserDropdown();
    }

}
