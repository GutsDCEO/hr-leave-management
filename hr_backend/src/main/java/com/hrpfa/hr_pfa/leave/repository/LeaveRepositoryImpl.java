package com.hrpfa.hr_pfa.leave.repository;

import com.hrpfa.hr_pfa.leave.model.LeaveRequest;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceContextType;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.*;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Repository
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
    
    @Override
    public long hasOverlappingLeaves(Long userId, LocalDate startDate, LocalDate endDate, List<String> statuses) {
        if (userId == null || startDate == null || endDate == null || statuses == null || statuses.isEmpty()) {
            return 0;
        }

        CriteriaBuilder cb = em.getCriteriaBuilder();
        CriteriaQuery<Long> cq = cb.createQuery(Long.class);
        Root<LeaveRequest> root = cq.from(LeaveRequest.class);

        // Build the query to count overlapping leaves
        List<Predicate> predicates = new ArrayList<>();
        
        // Match the user
        predicates.add(cb.equal(root.get("user").get("id"), userId));
        
        // Match the statuses
        predicates.add(root.get("status").in(statuses));
        
        // Check for date overlap
        // The new leave request (startDate, endDate) overlaps with an existing leave if:
        // existing.startDate <= new.endDate AND existing.endDate >= new.startDate
        Predicate startBeforeEnd = cb.lessThanOrEqualTo(root.get("startDate"), endDate);
        Predicate endAfterStart = cb.greaterThanOrEqualTo(root.get("endDate"), startDate);
        predicates.add(cb.and(startBeforeEnd, endAfterStart));
        
        cq.select(cb.count(root));
        cq.where(predicates.toArray(new Predicate[0]));
        
        return em.createQuery(cq).getSingleResult();
    }
}
