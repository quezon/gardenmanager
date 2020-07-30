package com.manager

import grails.gorm.services.Service

@Service(UnitOfMeasure)
interface UnitOfMeasureService {

    UnitOfMeasure get(Serializable id)

    List<UnitOfMeasure> list(Map args)

    Long count()

    void delete(Serializable id)

    UnitOfMeasure save(UnitOfMeasure unitOfMeasure)

}