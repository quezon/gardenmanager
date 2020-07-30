package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class PlantingMaterialServiceSpec extends Specification {

    PlantingMaterialService plantingMaterialService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new PlantingMaterial(...).save(flush: true, failOnError: true)
        //new PlantingMaterial(...).save(flush: true, failOnError: true)
        //PlantingMaterial plantingMaterial = new PlantingMaterial(...).save(flush: true, failOnError: true)
        //new PlantingMaterial(...).save(flush: true, failOnError: true)
        //new PlantingMaterial(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //plantingMaterial.id
    }

    void "test get"() {
        setupData()

        expect:
        plantingMaterialService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<PlantingMaterial> plantingMaterialList = plantingMaterialService.list(max: 2, offset: 2)

        then:
        plantingMaterialList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        plantingMaterialService.count() == 5
    }

    void "test delete"() {
        Long plantingMaterialId = setupData()

        expect:
        plantingMaterialService.count() == 5

        when:
        plantingMaterialService.delete(plantingMaterialId)
        sessionFactory.currentSession.flush()

        then:
        plantingMaterialService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        PlantingMaterial plantingMaterial = new PlantingMaterial()
        plantingMaterialService.save(plantingMaterial)

        then:
        plantingMaterial.id != null
    }
}
