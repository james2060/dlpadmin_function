# dlpadmin_function

#20250124
1. register_user api : 최초 사용자 정보 등록 시 access_token, refresh token 값이 response 된다.
2. access token 값은 로컬DB에 저장하고, 다른 api 호출 시 사용해야 한다. 
3. register_device api : accesstoken 값을 Authorization 에 Bearer Token 값으로 보내야 한다.
4. 단, access token 만료 시 refresh token 으로 access token 을 재발급 해야하는데, 재발급 api는 현재 미작업 상태이다.


*잔여 작업
1. read data with complex condition query
2. indexing on the firestore
3. file upload on the fire storage
4. analysis file with LLM (유사도)
5. UI Degine
