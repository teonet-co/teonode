# Teonet node authentication assistant application
 
 
### API:

#### 129 - CMD_CHECK_USER 

AccessToken for checking contains in data.


#### 96 - CMD_CHECK_USER_ANSWER 

Answers:
 * found - {accessToken, data}
 * not found - {accessToken, data: null}
 * error - {accessToken, error}
  
  
#### 131 - CMD_MANAGE_GROUPS 
  
data: {action: (add|remove), userId, group}

Note:
  * add: if group not exists it will be created
  * remove group from user
  
  
#### 132 - CMD_USER_INFO

data: ['userId1', 'userId2', ...]


#### 133 - CMD_USER_INFO_ANSWER

Answers:
 * found - [{userId, username}, ...]
 * not found - null
 * error - {error}
 
 
#### 134 - CMD_CLIENT_INFO

data: ['clientId1', 'clientId2', ...]


#### 135 - CMD_CLIENT_INFO_ANSWER

Answers:
 * found - [{clientId, registerDate, data: {}}, ...]
 * not found - null
 * error - {error}

### 136 - CMD_GET_NUM_USERS

no data
    
### 137 -CMD_GET_NUM_USERS_ANSWER

Answers:
 * found - { numUsers }
 * not found - null
 * error - { error }

### 138 - CMD_GET_USERS_LIST

no data
    
### 139 - CMD_GET_USERS_LIST_ANSWER

Answers:
 * found - [{ userId, username }]
 * not found - null
 * error - { error }

### 140 - CMD_GET_NETWORKS_LIST

no data
    
### 141 - CMD_GET_NETWORKS_LIST_ANSWER

Answers:
 * found - [{ userId, username }]
 * not found - null
 * error - { error }

### 142 - CMD_EDIT_NETWORK

 data: { mode, network }
   
### 143 - CMD_EDIT_NETWORK_ANSWER

 Answers:
 no data

