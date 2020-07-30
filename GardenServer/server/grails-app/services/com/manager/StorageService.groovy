package com.manager

import grails.gorm.services.Service

@Service(Storage)
interface StorageService {

    Storage get(Serializable id)

    List<Storage> list(Map args)

    Long count()

    void delete(Serializable id)

    Storage save(Storage storage)

}