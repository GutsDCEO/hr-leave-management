package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import jakarta.persistence.PersistenceContextType;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;


import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class LeaveRepositoryImpl implements LeaveRepositoryCustom {

    @PersistenceContext(type = PersistenceContextType.EXTENDED)
    private EntityManager em;

    @Override
    public Page<LeaveRequest> findFiltered(String status, Long employeeId, LocalDate startDate, LocalDate endDate, Pageable pageable) {
        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<LeaveRequest> cq = cb.createQuery(LeaveRequest.class);
        Root<LeaveRequest> root = cq.from(LeaveRequest.class);

        List<Predicate> predicates = new ArrayList<>();

        if (status != null) {
            predicates.add(cb.equal(root.get("status"), status));
        }
        if (employeeId != null) {
            predicates.add(cb.equal(root.get("user").get("id"), employeeId));
        }
        if (startDate != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("startDate"), startDate));
        }
        if (endDate != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("endDate"), endDate));
        }

        cq.where(predicates.toArray(new Predicate[0]));
        cq.orderBy(cb.desc(root.get("startDate")));

        TypedQuery<LeaveRequest> query = em.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());

        List<LeaveRequest> resultList = query.getResultList();

        // Count query
        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<LeaveRequest> countRoot = countQuery.from(LeaveRequest.class);
        countQuery.select(cb.count(countRoot)).where(predicates.toArray(new Predicate[0]));
        Long count = em.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, count);
    }
}
