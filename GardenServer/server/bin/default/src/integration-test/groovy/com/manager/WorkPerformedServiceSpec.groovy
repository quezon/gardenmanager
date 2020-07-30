package com.manager

import grails.testing.mixin.integration.Integration
import grails.gorm.transactions.Rollback
import spock.lang.Specification
import org.hibernate.SessionFactory

@Integration
@Rollback
class WorkPerformedServiceSpec extends Specification {

    WorkPerformedService workPerformedService
    SessionFactory sessionFactory

    private Long setupData() {
        // TODO: Populate valid domain instances and return a valid ID
        //new WorkPerformed(...).save(flush: true, failOnError: true)
        //new WorkPerformed(...).save(flush: true, failOnError: true)
        //WorkPerformed workPerformed = new WorkPerformed(...).save(flush: true, failOnError: true)
        //new WorkPerformed(...).save(flush: true, failOnError: true)
        //new WorkPerformed(...).save(flush: true, failOnError: true)
        assert false, "TODO: Provide a setupData() implementation for this generated test suite"
        //workPerformed.id
    }

    void "test get"() {
        setupData()

        expect:
        workPerformedService.get(1) != null
    }

    void "test list"() {
        setupData()

        when:
        List<WorkPerformed> workPerformedList = workPerformedService.list(max: 2, offset: 2)

        then:
        workPerformedList.size() == 2
        assert false, "TODO: Verify the correct instances are returned"
    }

    void "test count"() {
        setupData()

        expect:
        workPerformedService.count() == 5
    }

    void "test delete"() {
        Long workPerformedId = setupData()

        expect:
        workPerformedService.count() == 5

        when:
        workPerformedService.delete(workPerformedId)
        sessionFactory.currentSession.flush()

        then:
        workPerformedService.count() == 4
    }

    void "test save"() {
        when:
        assert false, "TODO: Provide a valid instance to save"
        WorkPerformed workPerformed = new WorkPerformed()
        workPerformedService.save(workPerformed)

        then:
        workPerformed.id != null
    }
}
