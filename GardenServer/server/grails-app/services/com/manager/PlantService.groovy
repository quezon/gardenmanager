package com.manager

import grails.gorm.services.Service

@Service(Plant)
interface PlantService {

    Plant get(Serializable id)

    List<Plant> list(Map args)

    Long count()

    void delete(Serializable id)

    Plant save(Plant plant)

}