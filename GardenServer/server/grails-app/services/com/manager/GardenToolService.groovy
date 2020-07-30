package com.manager

import grails.gorm.services.Service

@Service(GardenTool)
interface GardenToolService {

    GardenTool get(Serializable id)

    List<GardenTool> list(Map args)

    Long count()

    void delete(Serializable id)

    GardenTool save(GardenTool gardenTool)

}