package com.manager

import grails.gorm.services.Service

@Service(PlantingMaterial)
interface PlantingMaterialService {

    PlantingMaterial get(Serializable id)

    List<PlantingMaterial> list(Map args)

    Long count()

    void delete(Serializable id)

    PlantingMaterial save(PlantingMaterial plantingMaterial)

}