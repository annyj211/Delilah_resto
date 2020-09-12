CREATE SCHEMA `delilah_resto` ;

CREATE TABLE `delilah_resto`.`role` (
  `role_id` INT NOT NULL AUTO_INCREMENT,
  `role` VARCHAR(255) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`role_id`));

  INSERT INTO delilah_resto.role (role, description) VALUES ('Admin','This is the main role'),('User','This is costumer role');

  SELECT * FROM delilah_resto.role;

  CREATE TABLE `delilah_resto`.`user` (
  `user_id` INT NOT NULL AUTO_INCREMENT,
  `role_id` INT NOT NULL DEFAULT 2,
  `username` VARCHAR(255) NOT NULL,
  `full_name` VARCHAR(255) NOT NULL,
  `email` VARCHAR(255) NOT NULL,
  `phone` VARCHAR(255) NOT NULL,
  `address` VARCHAR(255) NOT NULL,
  `password` VARCHAR(255) NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`user_id`),
  UNIQUE INDEX `username_UNIQUE` (`username` ASC),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC),
  INDEX `fk_role_id_idx` (`role_id` ASC),
  CONSTRAINT `fk_role_id`
    FOREIGN KEY (`role_id`)
    REFERENCES `delilah_resto`.`role` (`role_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `delilah_resto`.`user` (`role_id`, `username`, `full_name`, `email`, `phone`, `address`, `password`) VALUES ('1', 'lssg', 'Luz Stella Soto G', 'lssotog@gmail.com', '3016431498', 'Calle 123#45-67', 'contrasenaadmin');

CREATE TABLE `delilah_resto`.`product` (
  `product_id` INT NOT NULL AUTO_INCREMENT,
  `product_name` VARCHAR(255) NOT NULL,
  `product_description` VARCHAR(255) NOT NULL,
  `price` DECIMAL(7,2) NOT NULL,
  `image_url` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`product_id`),
  UNIQUE INDEX `product_id_UNIQUE` (`product_id` ASC) );

INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Bagel de salmón', 'Bagel especiado con cebolla, sal, comino y queso; relleno de salmon asado con sal rosada del Himalaya', '425', 'https://placeralplato.com/files/2016/07/Bagels-de-salmn-e1468696119574.jpg');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Hamburguesa clásica', 'Hamburguesa carne, queso americano premium, lechuga, tomate y salsa de la casa.', '350', 'https://hips.hearstapps.com/hmg-prod.s3.amazonaws.com/images/sabemos-porque-el-logo-de-mcdonal-s-es-de-color-amarillo-1534934316.jpg?resize=980:*');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Sandwich veggie', 'Sándwich de vegetales que esta elaborado con pan integral 7 granos y esta relleno de germinado de trigo, tofu, tomate, pepino y salsa de guacamole310', '310', 'https://73f0e1518e903443913e6712-triedandtastycom.netdna-ssl.com/wp-content/uploads/2014/09/ultimate-veggie-sandwich-updated-19.jpg');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Ensalada veggie', 'Ensalada de brocoli grillado con arvejas, arroz, frijoles verdes, pepeino, champiñones, cebollin y cilantro.', '340', 'https://images.immediate.co.uk/production/volatile/sites/2/2017/09/OLI1017-TumericCauliflowerSalad_014532.jpg?webp=true&quality=45&resize=1880%2C799');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Focaccia', 'Foccacia con bordes caramelizados, miga masticable y una cobertura de romero y jugosos tomates.', '300', 'https://www.bakefromscratch.com/wp-content/uploads/2019/07/RedStarFocacciaAd196_NDBfull.jpg');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Sandwich Focaccia', 'Pan de focaccia, pollo, lechuga romana, albahaca y queso parmesano', '440', 'https://purewows3.imgix.net/images/articles/2018_03/chicken-pesto-focaccia-sandwiches-recipe-hero.jpg?auto=format,compress&cs=strip');
INSERT INTO `delilah_resto`.`product` (`product_name`, `product_description`, `price`, `image_url`) VALUES ('Ensalada Focaccia', 'Sobre un pan de foccacia se encuentran las lechugas romana y rugula, tomates cherry, queso de bufula y jamon serrano', '440', 'https://imgp3.schaer.com/sites/default/files/styles/header_large/public/2018-01/1919_Focaccia%20mit%20Rucola%20Burrata-Kaese%20Tomaten%20und%20Rohschinken%20.jpg?itok=bipPpctI');

CREATE TABLE `delilah_resto`.`status` (
  `status_id` INT NOT NULL AUTO_INCREMENT,
  `status` VARCHAR(45) NOT NULL,
  `description` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`status_id`),
  UNIQUE INDEX `status_UNIQUE` (`status` ASC) );

INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('NUEVO', 'Nuevo pedido');
INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('CONFIRMADO', 'El restaurante ha recibido el pedido');
INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('PREPARANDO', 'En proceso de preparación');
INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('ENVIANDO ', 'Enviado el pedido');
INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('ENTREGADO', 'Pedido entregado');
INSERT INTO `delilah_resto`.`status` (`status`, `description`) VALUES ('CANCELADO', 'Pedido cancelado');

CREATE TABLE `delilah_resto`.`payment_method` (
  `payment_method_id` INT NOT NULL AUTO_INCREMENT,
  `payment_method` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`payment_method_id`));

INSERT INTO `delilah_resto`.`payment_method` (`payment_method`) VALUES ('EFECTIVO');
INSERT INTO `delilah_resto`.`payment_method` (`payment_method`) VALUES ('TARJETA');

CREATE TABLE `delilah_resto`.`order` (
  `order_id` INT NOT NULL AUTO_INCREMENT,
  `user_id` INT NOT NULL,
  `status_id` INT NOT NULL,
  `payment_method_id` INT NOT NULL,
  `creation_date` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`order_id`),
  INDEX `fk_user_id_idx` (`user_id` ASC) ,
  INDEX `fk_status_id_idx` (`status_id` ASC) ,
  INDEX `fk_payment_method_id_idx` (`payment_method_id` ASC) ,
  CONSTRAINT `fk_user_id`
    FOREIGN KEY (`user_id`)
    REFERENCES `delilah_resto`.`user` (`user_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_status_id`
    FOREIGN KEY (`status_id`)
    REFERENCES `delilah_resto`.`status` (`status_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_payment_method_id`
    FOREIGN KEY (`payment_method_id`)
    REFERENCES `delilah_resto`.`payment_method` (`payment_method_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `delilah_resto`.`order` (`user_id`, `status_id`, `payment_method_id`) VALUES ('1', '4', '2');

CREATE TABLE `delilah_resto`.`order_detail` (
  `order_detail_id` INT NOT NULL AUTO_INCREMENT,
  `order_id` INT NOT NULL,
  `product_id` INT NOT NULL,
  `quantity` INT NOT NULL,
  `total_product_price` DECIMAL(7,2) NOT NULL,
  PRIMARY KEY (`order_detail_id`),
  INDEX `fk_order_id_idx` (`order_id` ASC) ,
  INDEX `fk_product_id_idx` (`product_id` ASC) ,
  CONSTRAINT `fk_order_id`
    FOREIGN KEY (`order_id`)
    REFERENCES `delilah_resto`.`order` (`order_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_product_id`
    FOREIGN KEY (`product_id`)
    REFERENCES `delilah_resto`.`product` (`product_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION);

INSERT INTO `delilah_resto`.`order_detail` (`order_id`, `product_id`, `quantity`, `total_product_price`) VALUES ('1', '1', '1', '425');
INSERT INTO `delilah_resto`.`order_detail` (`order_id`, `product_id`, `quantity`, `total_product_price`) VALUES ('1', '2', '2', '700');
INSERT INTO `delilah_resto`.`order_detail` (`order_id`, `product_id`, `quantity`, `total_product_price`) VALUES ('1', '3', '1', '310');
