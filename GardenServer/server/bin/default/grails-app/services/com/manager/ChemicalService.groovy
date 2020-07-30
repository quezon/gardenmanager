package com.manager

import grails.gorm.services.Service

@Service(Chemical)
interface ChemicalService {

    Chemical get(Serializable id)
	
	Chemical findByChemId(Integer id)

    List<Chemical> list(Map args)

    Long count()

    void delete(Serializable id)

    Chemical save(Chemical chemical)

}