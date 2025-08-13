package com.hrpfa.hr_pfa.admin.user.spec;

import com.hrpfa.hr_pfa.user.model.User;
import org.springframework.data.jpa.domain.Specification;

public final class UserSpecifications {

    private UserSpecifications() {
    }

    public static Specification<User> hasRole(String role) {
        return (root, query, cb) -> role == null || role.isBlank()
                ? cb.conjunction()
                : cb.equal(root.get("role"), role);
    }

    public static Specification<User> matchesQuery(String q) {
        return (root, query, cb) -> {
            if (q == null || q.isBlank())
                return cb.conjunction();
            String like = "%" + q.toLowerCase() + "%";
            return cb.or(
                    cb.like(cb.lower(root.get("firstName")), like),
                    cb.like(cb.lower(root.get("lastName")), like),
                    cb.like(cb.lower(root.get("email")), like));
        };
    }
}
