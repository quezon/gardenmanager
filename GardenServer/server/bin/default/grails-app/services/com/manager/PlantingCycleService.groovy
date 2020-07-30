package com.manager

import grails.gorm.services.Service

@Service(PlantingCycle)
interface PlantingCycleService {

    PlantingCycle get(Serializable id)

    List<PlantingCycle> list(Map args)

    Long count()

    void delete(Serializable id)

    PlantingCycle save(PlantingCycle plantingCycle)

}