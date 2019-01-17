#查询用户账号密码
select u.id, u.user_name, a.auth_type, a.token
FROM users u INNER JOIN user_auths a
ON u.id=a.id_user AND u.`status`=1 AND a.`status`=1
And u.user_name='root' AND auth_type='passwd' AND token='4b2609389ff786f6eb3e288e774117ed'


SELECT `s.name` AS "Student name" FROM `students` `s`

SELECT `s`.`name` AS "Student name" FROM `students` `s`
