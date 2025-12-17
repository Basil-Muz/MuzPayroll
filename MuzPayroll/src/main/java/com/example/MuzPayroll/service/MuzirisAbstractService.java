package com.example.MuzPayroll.service;

import com.example.MuzPayroll.controller.Response;

public abstract class MuzirisAbstractService<D, E> {

    // 1️⃣ Validations
    public abstract Response<Boolean> entityValidate(D dto);

    public abstract Response<Boolean> businessValidate(D dto);

    // 2️⃣ Populate entity from DTO
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

    // ================== FINAL SAVE METHOD ==================
    public final Response<D> save(D dto) {

        // 1. Entity validation
        Response<Boolean> r1 = entityValidate(dto);
        if (!r1.isSuccess()) {
            return Response.error(r1.getMessage());
        }

        // 2. Business validation
        Response<Boolean> r2 = businessValidate(dto);
        if (!r2.isSuccess()) {
            return Response.error(r2.getMessage());
        }

        // 3. Generate serial/code
        Response<String> r3 = generateSerialNo(dto);
        if (!r3.isSuccess()) {
            return Response.error(r3.getMessage());
        }

        // 4. Populate entity
        Response<E> r4 = entityPopulate(dto);
        if (!r4.isSuccess()) {
            return Response.error(r4.getMessage());
        }

        E entity = r4.getData();

        // 5. Generate PK
        Response<Object> r5 = generatePK(dto);
        if (!r5.isSuccess()) {
            return Response.error(r5.getMessage());
        }

        // 6. Save entity
        E savedEntity = saveEntityInService(entity, dto);

        // 7. Convert entity to DTO
        D savedDto = entityToDto(savedEntity);

        return Response.success(savedDto);

    }

}
