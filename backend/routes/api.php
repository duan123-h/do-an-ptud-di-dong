<?php

use App\Http\Controllers\StatisticsController;
use App\Http\Controllers\auth\AuthController;
use App\Http\Controllers\BlogController;
use App\Http\Controllers\CommuneController;
use App\Http\Controllers\DepartmentController;
use App\Http\Controllers\DiseaseController;
use App\Http\Controllers\DiseasegroupController;
use App\Http\Controllers\DispositionController;
use App\Http\Controllers\DoctorController;
use App\Http\Controllers\DosageformController;
use App\Http\Controllers\EthnicgroupController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\FavoriteBlogController;
use App\Http\Controllers\HamletController;
use App\Http\Controllers\ImagingResultController;
use App\Http\Controllers\ImportReceiptController;
use App\Http\Controllers\InventoryController;
use App\Http\Controllers\LabResulDdetailController;
use App\Http\Controllers\LabResultDetailController;
use App\Http\Controllers\ManufacturerController;
use App\Http\Controllers\MedicalexaminationController;
use App\Http\Controllers\MedicineController;
use App\Http\Controllers\MenuController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\OutpatientclinicController;
use App\Http\Controllers\OutpatientregistrationController;
use App\Http\Controllers\PatientController;
use App\Http\Controllers\PrescriptionController;
use App\Http\Controllers\ProvinceController;
use App\Http\Controllers\RoomController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\RoomtypeController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\ServicecategoryController;
use App\Http\Controllers\ServiceController;
use App\Http\Controllers\ServicerequestController;
use App\Http\Controllers\ServicerequestdetailController;
use App\Http\Controllers\SliderController;
use App\Http\Controllers\StaffController;
use App\Http\Controllers\SupplierController;
use App\Http\Controllers\UserDeviceController;
use App\Http\Controllers\WarehouseController;
use App\Models\ImportReceipt;
use App\Models\Medicine;
use App\Models\Outpatientregistration;
use App\Models\Service;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

//address

Route::apiResources([
    "provinces" => ProvinceController::class,
    "communes" => CommuneController::class,
    "hamlets" => HamletController::class,
    "ethnicgroups" => EthnicgroupController::class
]);

Route::get('/provinces/{provinceid}/communes', [ProvinceController::class, 'getCommunes']);
Route::get('/communes/{communeid}/hamlets', [CommuneController::class, 'getHamlets']);


//patient

Route::post('/login', [AuthController::class, 'login']);
Route::middleware("CustomAuth")->get('/currentuser', [AuthController::class, 'user']);
Route::middleware("CustomAuth")->get('/users/profile', [UserController::class, 'profile']);
Route::middleware("CustomAuth")->post('/users/changepassword', [UserController::class, 'changePassword']);
Route::middleware("CustomAuth")->post('/users/updateprofile', [UserController::class, 'updateProfile']);

Route::middleware("CustomAuth")->get('/users/outpatientregistrations', [OutpatientregistrationController::class, 'getIndexByUser']);
Route::middleware("CustomAuth")->get('/users/outpatientregistrations/{id}', [OutpatientregistrationController::class, 'showByUser']);

Route::middleware("CustomAuth")->get('/users/servicerequests', [ServicerequestController::class, 'getIndexByUser']);



Route::middleware("CustomAuth")->apiResource('/favoriteblogs', FavoriteBlogController::class)->only(['index',"store","destroy"]);

Route::apiResource('staffs', StaffController::class)->only(['index',"show"]);
Route::middleware("CustomAuth:Admin")->apiResource('staffs', StaffController::class)->only(['update',"store","destroy"]);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware("CustomAuth")->post('/users/savedevice', [UserDeviceController::class, 'saveUserDevice']);



Route::apiResource('departments', DepartmentController::class);
Route::apiResource('blogs', BlogController::class)->only(['index','show']);
Route::middleware("CustomAuth")->apiResource('/users/prescriptions', PrescriptionController::class)->only(['index','show']);

Route::middleware("CustomAuth")->get('/users/medicalexaminations', [MedicalexaminationController::class, 'showByUser']);
Route::middleware("CustomAuth")->apiResource('/users/medicalexaminations', MedicalexaminationController::class)->only(['index']);

Route::middleware("CustomAuth")->get('/users/servicerequests/{id}/details', [ServicerequestController::class, 'showDetailsByUser']);

Route::apiResource('sliders', SliderController::class)->only(['index']);


Route::middleware('CustomAuth')->group(function () {

    Route::get('/notifications', [NotificationController::class, 'index']);

    Route::post('/notifications/{id}/read', [NotificationController::class, 'markAsRead']);

    Route::post('/notifications/read-all', [NotificationController::class, 'markAllAsRead']);

    Route::get('/notifications/countnotread', [NotificationController::class, 'getCountNotReadByUser']);
});



//
Route::post('/login', [AuthController::class, 'login']);
Route::middleware("CustomAuth")->get('/currentuser', [AuthController::class, 'user']);
Route::apiResource('outpatientclinics', OutpatientclinicController::class)->only('index');
Route::apiResource('/his/outpatientregistrations', OutpatientregistrationController::class)->only('index');
Route::apiResource('diseases', DiseaseController::class)->only('index');
Route::apiResource('services', ServiceController::class)->only('index');
Route::apiResource('warehouses', WarehouseController::class)->only('index');
Route::apiResource('departments', DepartmentController::class)->only('index');
Route::apiResource('routes', RouteController::class)->only('index');
Route::apiResource('medicines', MedicineController::class)->only('index');
Route::apiResource('manufacturers', ManufacturerController::class)->only('index');
Route::apiResource('suppliers', SupplierController::class)->only('index');
Route::apiResource('dispositions', DispositionController::class)->only('index');

Route::apiResource('menus', MenuController::class)->only('index');
Route::apiResource('sliders', SliderController::class)->only('index');
Route::apiResource('blogs', BlogController::class)->only(['index','show']);
Route::apiResource('doctors', DoctorController::class)->only(['index']);
Route::apiResources([
    "provinces" => ProvinceController::class,
    "communes" => CommuneController::class,
    "hamlets" => HamletController::class,
    "ethnicgroups" => EthnicgroupController::class
]);

Route::get('/provinces/{provinceid}/communes', [ProvinceController::class, 'getCommunes']);
Route::get('/communes/{communeid}/hamlets', [CommuneController::class, 'getHamlets']);

Route::middleware("CustomAuth:Admin")->group(function () {
    Route::apiResource('outpatientclinics', OutpatientclinicController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('diseases', DiseaseController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('services', ServiceController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('warehouses', WarehouseController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('departments', DepartmentController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('medicines', MedicineController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('manufacturers', ManufacturerController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('suppliers', SupplierController::class)->only(['show', 'store', 'update', 'destroy']);

    Route::apiResource('menus', MenuController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('sliders', SliderController::class)->only(['show', 'store', 'update', 'destroy']);
    Route::apiResource('blogs', BlogController::class)->only(['store', 'update', 'destroy']);
    Route::apiResource('doctors', DoctorController::class)->only(['store','show', 'update', 'destroy']);

    Route::apiResources([
        "users" => UserController::class,
        "rooms" => RoomController::class,
        "roomtypes" => RoomtypeController::class,
        "diseasegroups" => DiseasegroupController::class,
        "servicecategorys" => ServicecategoryController::class,
        "dosageforms" => DosageformController::class,
    ]);
});
Route::middleware("CustomAuth:Admin")->get('/rooms/isactive/{id}', [RoomController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/services/isactive/{id}', [ServiceController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/servicecategorys/isactive/{id}', [ServicecategoryController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/warehouses/isactive/{id}', [WarehouseController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/menus/isactive/{id}', [MenuController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/blogs/isactive/{id}', [BlogController::class, 'isactive']);
Route::middleware("CustomAuth:Admin")->get('/sliders/isactive/{id}', [SliderController::class, 'isactive']);
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/currentuser', [AuthController::class, 'user']);
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/patients/{id}', [PatientController::class, 'show']);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('/his/outpatientregistrations', OutpatientregistrationController::class)->only(['show', 'store', 'update', 'destroy']);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('/his/medicalexams', MedicalexaminationController::class)->only(['show', 'store', 'update', 'destroy']);
Route::apiResource('/his/medicalexams', MedicalexaminationController::class)->only('index');
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/medicalexams/{id}/start', [MedicalexaminationController::class, 'start']);
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/medicalexams/{id}/end', [MedicalexaminationController::class, 'end']);
Route::middleware("CustomAuth:Admin|Doctor")->post('/his/medicalexams/handledisposition', [MedicalexaminationController::class, 'handleDisposition']);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('/his/servicerequestdetails', ServicerequestdetailController::class);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('/his/servicerequests', ServicerequestController::class);
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/servicerequests/{id}/details', [ServicerequestController::class, 'details']);
Route::middleware("CustomAuth:Admin|Doctor")->get('/his/servicerequestdetails/{id}/start', [ServicerequestdetailController::class, 'start']);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('labresultdetails', LabResultDetailController::class);
Route::middleware("CustomAuth:Admin|Doctor")->apiResource('imagingresults', ImagingResultController::class);

Route::get('/servicerequestdetails/{id}/result', [ServicerequestdetailController::class, 'result']);

Route::middleware("CustomAuth:Admin|Doctor")->get('/la/{id}/end', [ServicerequestdetailController::class, 'end']);

Route::middleware("CustomAuth:Admin|WarehouseManager")->group(function () {
    Route::apiResources([
        "inventorys" => InventoryController::class,
        "importreceipts" => ImportReceiptController::class,
    ]);
});
Route::middleware("CustomAuth:Admin|WarehouseManager|Doctor")->get("/prescriptions/show", [PrescriptionController::class, "show"]);
Route::middleware("CustomAuth:Admin|WarehouseManager|Doctor")->get("/prescriptions/{id}/details", [PrescriptionController::class, "details"]);
Route::middleware("CustomAuth:Admin|Doctor")->post("/prescriptions/", [PrescriptionController::class, "store"]);
Route::get("/inventorys/{id}/medicines", [InventoryController::class, "medicines"]);
Route::middleware("CustomAuth:Admin|WarehouseManager")->get("/importreceipts/process/{id}", [ImportReceiptController::class, "process"]);

Route::get("/statistics/patient", [StatisticsController::class, "patient"]);
Route::middleware("CustomAuth:Admin")->get("/statistics/outpatient", [StatisticsController::class, "outpatient"]);
Route::middleware("CustomAuth:Admin")->get("/statistics/examination", [StatisticsController::class, "examination"]);
Route::middleware("CustomAuth:Admin|WarehouseManager")->get("/prescriptions", [PrescriptionController::class, "index"]);
Route::middleware("CustomAuth:Admin|WarehouseManager")->post("/exports/prescription", [ExportController::class, "exportPrescription"]);
Route::middleware("CustomAuth:Admin|WarehouseManager")->post("/exports/prescription/destroy", [ExportController::class, "destroyExportPrescription"]);


