# Teonet node authentication assistant application
 
 
### API:

#### 129 - CMD_CHECK_USER 

AccessToken for checking contains in data.


#### 130 - CMD_CHECK_USER_ANSWER 

Answers:
 * found - {accessTokens, data}
 * not found - {accessTokens, data: null}
 * error - {accessTokens, error}
  
#### 131 - CMD_MANAGE_GROUPS 
  
data: {action: (add|remove), userId, group}

Note:
  * add: if group not exists it will be created
  * remove group from user