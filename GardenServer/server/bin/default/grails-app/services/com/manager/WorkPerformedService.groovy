package com.manager

import grails.gorm.services.Service

@Service(WorkPerformed)
interface WorkPerformedService {

    WorkPerformed get(Serializable id)

    List<WorkPerformed> list(Map args)

    Long count()

    void delete(Serializable id)

    WorkPerformed save(WorkPerformed workPerformed)

}