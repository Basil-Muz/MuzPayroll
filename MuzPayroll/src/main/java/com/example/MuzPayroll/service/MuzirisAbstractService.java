package com.example.MuzPayroll.service;

import com.example.MuzPayroll.entity.DTO.Response;

public abstract class MuzirisAbstractService<D, E> {

    // Validations
    public abstract Response<Boolean> entityValidate(D dto);

    // business Validations
    public abstract Response<Boolean> businessValidate(D dto);

    // Populate entity from DTO
    public abstract Response<Boolean> entityPopulate(D dto);

    // Generate PK if needed
    public abstract Response<Object> generatePK(D dto);

    // Generate serial code
    public abstract Response<String> generateSerialNo(D dto);

    public abstract Response<E> converttoEntity(D dto);

    // Convert entity → DTO (Optional)
    public D entityToDto(E entity) {
        throw new UnsupportedOperationException("entityToDto not implemented");
    }

    // Convert DTO → entity (Optional)
    protected E dtoToEntity(D dto) {
        throw new UnsupportedOperationException("dtoToEntity not implemented");
    }

    // Concrete service must implement this to save the entity in DB
    protected abstract E saveEntity(E entity, D dto);

    public final Response<D> save(D dto) {

        // 1. Entity validation
        Response<Boolean> r1 = entityValidate(dto);
        if (!r1.isSuccess()) {
            return Response.error(r1.getErrors(), r1.getStatusCode());
        }

        // 2. Entity Populate
        Response<Boolean> r2 = entityPopulate(dto);
        if (!r2.isSuccess()) {
            return Response.error(r2.getErrors(), r2.getStatusCode());
        }

        // 3. Business validation
        Response<Boolean> r3 = businessValidate(dto);
        if (!r3.isSuccess()) {
            return Response.error(r3.getErrors(), r3.getStatusCode());
        }

        // 4. Generate PK
        Response<Object> pkResult = generatePK(dto);
        if (!pkResult.isSuccess()) {
            return Response.error("PK generation failed: " + pkResult.getErrors(), pkResult.getStatusCode());
        }

        // 5. Generate serial code
        Response<String> r5 = generateSerialNo(dto);

        if (!r5.isSuccess()) {
            return Response.error(r5.getErrors(), r5.getStatusCode());
        }

        // 6. Generate entity
        Response<E> r6 = converttoEntity(dto);

        if (!r6.isSuccess()) {
            return Response.error(r6.getErrors(), r6.getStatusCode());
        }

        // Get the entity after populate
        E entity = r6.getData();

        // 7. Save entity
        E savedEntity = saveEntity(entity, dto);

        // 8. Convert to DTO
        D savedDto = entityToDto(savedEntity);

        return Response.success(savedDto);
    }

}