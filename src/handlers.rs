use actix_web::{get, post, HttpResponse, Responder};


pub async fn index() -> impl Responder {
    "Hello Rust!"
}

// #[get("/")]
// pub async fn hello() -> impl Responder {
//     HttpResponse::Ok().body("Hello world!")
// }
