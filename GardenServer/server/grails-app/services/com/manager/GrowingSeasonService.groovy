package com.manager

import grails.gorm.services.Service

@Service(GrowingSeason)
interface GrowingSeasonService {

    GrowingSeason get(Serializable id)

    List<GrowingSeason> list(Map args)

    Long count()

    void delete(Serializable id)

    GrowingSeason save(GrowingSeason growingSeason)


}