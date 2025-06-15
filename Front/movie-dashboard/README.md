## Front

src/app/
├── auth/
│   ├── login/
│   └── register/
│
├── admin/
│   ├── dashboard/
│   ├── movie-list/
│   └── movie-search/
│
├── user/
│   ├── dashboard/
│   ├── movie-details/
│   └── search-bar/
│
├── services/
│   ├── auth.service.ts
│   ├── movie.service.ts
│   └── token.service.ts
│   └── loader.service.ts
│   └── toast.service.ts
│
├── guards/
│   └── auth.guard.ts
│
├── interceptors/
│   └── auth.interceptor.ts
│
├── models/
│   ├── user.ts
│   └── movie.ts
│   └── rating.ts



## Back

main/java/com.fawrytask.movies
├── config/
│   └── WebConfig
│   
│
├── controller/
│   ├── AuthController
│   ├── MovieController
│   └── RatingController
│
├── model/
│   ├── CustomUserDetails
│   ├── Movie
│   ├── Rating
│   ├── Role
│   └── User
│
├── repository/
│   ├── MovieRepository
│   ├── RatingRepository
│   └── UserRepository
|
├── security/
│   ├── CustomUserDetailsService
│   ├── JwtAuthenticationFilter
│   ├── JwtUtil
│   └── SecurityConfig
|
└── MoviesApplication


## To Run Front 
-- npm install
-- ng serve --proxy-config proxy.conf.json
## To Run Back
-- build and run










