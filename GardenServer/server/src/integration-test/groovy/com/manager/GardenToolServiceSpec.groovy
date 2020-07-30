package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class GardenToolServiceSpec extends Specification {

    GardenToolService gardenToolService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new GardenTool(...).save(flush: true, failOnError: true)
        //new GardenTool(...).save(flush: true, failOnError: true)
        //GardenTool gardenTool = new GardenTool(...).save(flush: true, failOnError: true)
        //new GardenTool(...).save(flush: true, failOnError: true)
        //new GardenTool(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //gardenTool.id
    }

    void "test get"() {
        setupData()

        expect:
        gardenToolService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<GardenTool> gardenToolList = gardenToolService.list(max: 2, offset: 2)

        then:
        gardenToolList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        gardenToolService.count() == 5
    }

    void "test delete"() {
        Long gardenToolId = setupData()

        expect:
        gardenToolService.count() == 5

        when:
        gardenToolService.delete(gardenToolId)
        sessionFactory.currentSession.flush()

        then:
        gardenToolService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        GardenTool gardenTool = new GardenTool()
        gardenToolService.save(gardenTool)

        then:
        gardenTool.id != null
    }
}
