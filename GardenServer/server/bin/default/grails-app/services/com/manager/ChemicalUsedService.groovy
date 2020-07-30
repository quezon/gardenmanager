package com.manager

import grails.gorm.services.Service

@Service(ChemicalUsed)
interface ChemicalUsedService {
	
	ChemicalService chemicalService

    ChemicalUsed get(Serializable id)

    List<ChemicalUsed> list(Map args)

    Long count()

    void delete(Serializable id)

    ChemicalUsed save(ChemicalUsed chemicalUsed)

}