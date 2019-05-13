CREATE SCHEMA cca
    CREATE TABLE users (
        user_id BIGINT,
        join_date timestamptz
    )
    CREATE TABLE schools (
        school_id SMALLINT,
        school_name text,
        school_abbr text,
        region text,
        state text,
        president BIGINT,
        founding_date timestamptz
    )
    CREATE TABLE students (
        student_id BIGINT,
        school_id SMALLINT,
        first_name text,
        last_name text,
        email text
    )
    CREATE TABLE rl_accounts (
        user_id BIGINT,
        system_type text,
        system_id text
    )
;

/***********************************************************************************************************************
* Assign Primary keys
***********************************************************************************************************************/

/* cca.users */
ALTER TABLE cca.users
    ADD CONSTRAINT pk__users PRIMARY KEY (user_id)
;

/* cca.schools*/
ALTER TABLE cca.schools
    ADD CONSTRAINT pk__schools PRIMARY KEY (school_id)
;

/* cca.students */
ALTER TABLE cca.students
    ADD CONSTRAINT pk__students PRIMARY KEY (student_id)
;

/* cca.systems */
ALTER TABLE cca.rl_accounts
    ADD CONSTRAINT pk__systems PRIMARY KEY (user_id, system_type)
;

/***********************************************************************************************************************
* Assign Foreign keys
***********************************************************************************************************************/

/* cca.schools*/
ALTER TABLE cca.schools
    ADD CONSTRAINT fk__schools__president FOREIGN KEY (president) REFERENCES cca.students(student_id)
;

/* cca.students */
ALTER TABLE cca.students
    ADD CONSTRAINT fk__students__student FOREIGN KEY (student_id) REFERENCES cca.users(user_id),
    ADD CONSTRAINT fk__students__school FOREIGN KEY (school_id) REFERENCES cca.schools(school_id)
;

/* cca.systems */
ALTER TABLE cca.rl_accounts
    ADD CONSTRAINT fk__systems__user_id FOREIGN KEY (user_id) REFERENCES cca.users(user_id)
;

/***********************************************************************************************************************
* Assign Other Constraints
***********************************************************************************************************************/

/* cca.users */
ALTER TABLE cca.rl_accounts
    ADD CONSTRAINT chk__systems__system_type_is_valid CHECK (system_type IN('xbox', 'psn', 'steam', 'switch'))
;