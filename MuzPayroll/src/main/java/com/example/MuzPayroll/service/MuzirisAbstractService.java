package com.example.MuzPayroll.service;

import com.example.MuzPayroll.DTO.CompanyDTO;
import com.example.MuzPayroll.controller.Response;
import com.example.MuzPayroll.entity.CompanyMst;

public abstract class MuzirisAbstractService<D, E> {

    // Validations
    public abstract Response<Boolean> entityValidate(D dto);

    public abstract Response<Boolean> businessValidate(D dto);

    // Populate entity from DTO
    public abstract Response<E> entityPopulate(D dto);

    // 3️⃣ Generate PK if needed
    public abstract Response<Object> generatePK(D dto);

    // 4️⃣ Generate serial/code
    public abstract Response<String> generateSerialNo(D dto);

    // 5️⃣ Convert entity → DTO
    public abstract D entityToDto(E entity);

    // 5️⃣ Convert DTO → entity
    protected abstract E dtoToEntity(D dto);

    // 6️⃣ Concrete service must implement this to save the entity in DB (all
    // related tables)
    protected abstract E saveEntityInService(E entity, D dto);

    public final Response<D> save(D dto) {
        System.out.println("=== SAVE METHOD STARTED ===");

        // 1. Entity validation
        Response<Boolean> r1 = entityValidate(dto);
        System.out.println("Entity Validation: success=" + r1.isSuccess() + ", message=" + r1.getMessage());
        if (!r1.isSuccess()) {
            return Response.error(r1.getMessage());
        }

        // 2. Business validation
        Response<Boolean> r2 = businessValidate(dto);
        System.out.println("Business Validation: success=" + r2.isSuccess() + ", message=" + r2.getMessage());
        if (!r2.isSuccess()) {
            return Response.error(r2.getMessage());
        }

        // 3. Generate serial/code
        System.out.println("Before generateSerialNo, DTO code: " + ((CompanyDTO) dto).getCode());
        Response<String> r3 = generateSerialNo(dto);
        System.out.println("Generate Serial: success=" + r3.isSuccess() + ", message=" + r3.getMessage());
        System.out.println("Generated code: " + r3.getData());
        System.out.println("After generateSerialNo, DTO code: " + ((CompanyDTO) dto).getCode());
        if (!r3.isSuccess()) {
            return Response.error(r3.getMessage());
        }

        // 4. Populate entity
        Response<E> r4 = entityPopulate(dto);
        System.out.println("Entity Populate: success=" + r4.isSuccess() + ", message=" + r4.getMessage());
        if (!r4.isSuccess()) {
            return Response.error(r4.getMessage());
        }

        E entity = r4.getData();
        System.out.println("Entity created, entity code: " + ((CompanyMst) entity).getCode());

        // Generate PK
        Response<Object> pkResult = generatePK(dto);
        if (!pkResult.isSuccess()) {
            return Response.error("PK generation failed: " + pkResult.getMessage());
        }

        // Save entity
        E savedEntity = saveEntityInService(entity, dto);

        // Convert to DTO
        D savedDto = entityToDto(savedEntity);

        return Response.success(savedDto);
    }

}
