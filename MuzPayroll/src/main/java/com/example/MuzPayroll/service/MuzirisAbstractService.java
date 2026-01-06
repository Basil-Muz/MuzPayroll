package com.example.MuzPayroll.service;

import java.util.List;

import com.example.MuzPayroll.entity.DTO.Response;

public abstract class MuzirisAbstractService<D, E> {

    // Validations
    public abstract Response<Boolean> entityValidate(List<D>dtos);

    // Populate entity from DTO
    public abstract Response<Boolean> entityPopulate(List<D>dtos);


    // business Validations
    public abstract Response<Boolean> businessValidate(List<D>dtos);


    // Generate PK if needed
    public abstract Response<Object> generatePK(List<D>dtos);

    // Generate serial code
    public abstract Response<String> generateSerialNo(List<D>dtos);

    public abstract Response<E> converttoEntity(List<D>dtos);

    // Convert entity → DTO (Optional)
    public D entityToDto(E entity) {
        throw new UnsupportedOperationException("entityToDto not implemented");
    }

    // Convert DTO → entity (Optional)
    protected E dtoToEntity(List<D> dto) {
        throw new UnsupportedOperationException("dtoToEntity not implemented");
    }

    // Concrete service must implement this to save the entity in DB
    protected abstract E saveEntity(E entity, List<D>dtos);

    public final Response<D> save(List<D> dtos) {

        // 1. Entity validation
        Response<Boolean> r1 = entityValidate(dtos);
        if (!r1.isSuccess()) {
            return Response.error(r1.getErrors(), r1.getStatusCode());
        }

        // // 2. Entity Populate
        Response<Boolean> r2 = entityPopulate(dtos);
        if (!r2.isSuccess()) {
            return Response.error(r2.getErrors(), r2.getStatusCode());
        }

        // 3. Business validation
        Response<Boolean> r3 = businessValidate(dtos);
        if (!r3.isSuccess()) {
            return Response.error(r3.getErrors(), r3.getStatusCode());
        }

        // 4. Generate PK
        Response<Object> pkResult = generatePK(dtos);
        if (!pkResult.isSuccess()) {
            return Response.error("PK generation failed: " + pkResult.getErrors(), pkResult.getStatusCode());
        }

        // 5. Generate serial code
        Response<String> r5 = generateSerialNo(dtos);

        if (!r5.isSuccess()) {
            return Response.error(r5.getErrors(), r5.getStatusCode());
        }

        // 6. Generate entity
        Response<E> r6 = converttoEntity(dtos);

        if (!r6.isSuccess()) {
            return Response.error(r6.getErrors(), r6.getStatusCode());
        }

        // Get the entity after populate
        E entity = r6.getData();

        // 7. Save entity
        E savedEntity = saveEntity(entity, dtos);

        // 8. Convert to DTO
        D savedDto = entityToDto(savedEntity);

        return Response.success(savedDto);
    }

}