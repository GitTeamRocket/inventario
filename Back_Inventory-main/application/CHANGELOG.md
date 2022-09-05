## [2.7.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/62) (2021-06-01)
**Modified**
- fix makefile permissions
- fix logs in console

## [2.7.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/60) (2021-05-19)
**Added/Modified**
- [VALLESOFT-286] Modified makefile service to add exportsReturningToExcel.
- Modified makefile method in ArticleController to include exportsArticlesToExcel.
- fix error updated available_state when borrowing was approve.

## [2.6.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/58) (2021-05-17)
**Modified**
- Modified makefile service to include worksheet in ExportsArticlesToExcel.
- Modified cert and key file in server.js.

## [2.6.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/57) (2021-05-15)
**Added/Modified**
- [VALLESOFT-59] Added service to make file report of articles in xlsx.
- fix error when modified article that have more than 2 articles associated.
- fix error in middleware in routes when some one of 3 rols access.

## [2.5.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/56) (2021-05-15)
**Modified**
- fix change password endpoint. 

## [2.5.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/55) (2021-05-14)
**Added**
- [VALLESOFT-238] Added service to update articles.
- fix approve request to update available_state in articles. 

## [2.4.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/54) (2021-05-14)
**Added**
- [VALLESOFT-243] Added update borrowing services.

## [2.3.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/53) (2021-05-12)
**Added/Modified**
- [VALLESOFT-239] Added update borrowing services. 
- fix change password service.

## [2.2.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/49-50) (2021-05-07)
**Added/Modified**
- [VALLESOFT-225] Added change password services. 
- fix message and errors.

## [2.1.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/47) (2021-05-06)
**Modified**
- fix token service to include rol in token.

## [2.1.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/46) (2021-05-05)
**Modified/Added**
- [VALLESOFT-226] Creation of rol and added service to modified user information.

## [2.0.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/45) (2021-05-05)
**Modified/Added**
- [VALLESOFT-49-50-51] Creation of the list users service, list unique user and the role field was added in the users table

## [1.18.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/44) (2021-04-22)
**Modified/Added**
- [VALLESOFT-49-50-51] Added user notification service 

## [1.17.2](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/43) (2021-04-18)
**Modified**
- fix error in server.

## [1.17.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/42) (2021-04-17)
**Modified**
- fix error in returning approve,reject and detail.

## [1.17.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/41) (2021-04-16)
**Modified**
- fix error in borrowing and article.
- [VALLESOFT-219] Added list returning by id

## [1.16.2](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/39) (2021-04-15)
**Modified**
- fix error in borrowing list for id

## [1.16.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/38) (2021-04-15)
**Modified**
- fix error in borrowing list

## [1.16.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/37) (2021-04-14)
**Modified**
- fix error in articles and returnings.
- [VALLESOFT-30] Added service to list by borrowing_id and has_returning

## [1.15.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/35) (2021-04-13)
**Modified**
- [VALLESOFT-204] Added service to approve,reject and list borrowing.

## [1.14.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/35) (2021-04-13)
**Modified**
- fix service to create article.

## [1.14.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/34) (2021-04-13)
**Modified**
- [VALLESOFT-204] Added service to list, approve and reject returning.

## [1.13.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/33) (2021-04-12)
**Modified/Added**
- Modified server.js to fix error
- [VALLESOFT-106] Added service to create returning.

## [1.12.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/31) (2021-04-11)
**Modified**
- Modified server.js to add https server

## [1.11.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/30) (2021-04-11)
**Modified**
- fix findall error and change findAll by findAndCountAll method.
- [VALLESOFT-101-107] Added service to filter articles by warehouse_id, branch and article_type.

## [1.10.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/27) (2021-04-9)
**Modified**
- [VALLESOFT-102] fix service to create Borrowing.

## [1.10.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/23) (2021-04-8)
**Added**
- [VALLESOFT-102] Service created to create Borrowing.

## [1.9.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/21) (2021-04-8)
**Added**
- [VALLESOFT-185] Service created to list type_Articles by classif.

## [1.9.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/21) (2021-04-8)
**Added**
- [VALLESOFT-185] Service created to list type_Articles by classif.

## [1.8.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/20) (2021-04-8)
**Added**
- [VALLESOFT-185] Service created to list Articles.

## [1.7.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/19) (2021-04-8)
**Added**
- [VALLESOFT-93] Service created to create Articles.

## [1.6.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/16) (2021-04-2)
**Added/Modified**
- [VALLESOFT-98] Update models, controllers and install sequelize-cli.

## [1.5.1](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/14) (2021-04-1)
**Added**
- [VALLESOFT-98] Bug fix in the "Item Type" controller and changes to existing models.

## [1.5.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/11) (2021-03-29)
**Added**
- [VALLESOFT-98] Service created list all types of articles. 

## [1.4.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/10) (2021-03-29)
**Added**
- [VALLESOFT-83] Service created to create Article Type. 

## [1.3.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/9) (2021-03-28)
**Added**
- [VALLESOFT-96] Service created to list warehouses . 

## [1.2.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/8) (2021-03-28)
**Added/Modified**
- The user model is updated.
- [VALLESOFT-95] Service created to create warehouse. 

## [1.1.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/6) (2021-03-28)
**Added**
- The gitignore file is updated.
- [VALLESOFT-84] Service created to login users. 

## [1.0.0](https://github.com/TEAMVALLESOFT/Back_Inventory/pull/4) (2021-03-27)
**Added**
- The structure of the package.json is updated.
- [VALLESOFT-90] Service created to create users. 
