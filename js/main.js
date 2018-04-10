var container, rollOverGeo;
var camera, scene, renderer;
var plane, cube ;
var mouse, raycaster, isShiftDown = false,isctrl=false;

var rollOverMesh, rollOverMaterial;
var cubeGeo, cubeMaterial;

var objects = [];

init();
render();//渲染


function init() {

    camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);//设置透视投影的相机
    camera.position.set(500, 800, 1300);//设置相机坐标
    camera.lookAt(new THREE.Vector3());//设置视野的中心坐标
    scene = new THREE.Scene();//设置场景,场景是一个三维空间，用Scene类声明一个对象

    // grid，定义画布上的坐标格子
    var size = 1000, step = 50;
    var geometry = new THREE.Geometry();//创建一个基本的几何形状
    //绘制网格
    for (var i = -size; i <= size; i += step) {
        geometry.vertices.push(new THREE.Vector3(-size, 0, i));//横向
        geometry.vertices.push(new THREE.Vector3(size, 0, i));//横向
        //console.log(-size + '--' + i)
        //console.log(size + '--' + i)
        geometry.vertices.push(new THREE.Vector3(i, 0, -size));//竖向
        geometry.vertices.push(new THREE.Vector3(i, 0, size));//竖向
    }
    //创建一个线条材质，线条颜色黑色，透明度0.2
    var material = new THREE.LineBasicMaterial({color: 0x000000, opacity: 0.2, transparent: true});
    var line = new THREE.LineSegments(geometry, material);
    scene.add(line);

    raycaster = new THREE.Raycaster();
    mouse = new THREE.Vector2();
    var geometry = new THREE.PlaneBufferGeometry(2000, 2000);
    geometry.rotateX(-Math.PI / 2);
    geometry.receiveShadow=true;
    plane = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial({visible: false,
        shading:THREE.FlatShading
    }));
    plane.receiveShadow=true;
    scene.add(plane);
    objects.push(plane);
    createLights();
    renderer = new THREE.WebGLRenderer({antialias: true});//生成渲染器对象，锯齿效果为true
    renderer.shadowMap.enabled = true;
    renderer.setClearColor(0xf0f0f0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth-80, window.innerHeight-80);
    container = document.getElementById('all');//使用createElement创建一个div，就是整个页面
    container.appendChild(renderer.domElement);
    document.addEventListener('mousemove', onDocumentMouseMove, false);//鼠标移动事件
   // document.addEventListener('mousedown', onDocumentMouseDown, false);//鼠标点击事件
    document.addEventListener('keydown', onDocumentKeyDown, false);//对shift按键的控制
    document.addEventListener('keyup', onDocumentKeyUp, false);//对shift按键的控制
    window.addEventListener('resize', onWindowResize, false);//窗口改变事件
}
function render() {
    renderer.render(scene, camera);
}
function method(a) {
    switch (a) {
        case 1:
            // 实体对象，就是鼠标点击确定之后的实体对象，并且实体对象的图片引入
            cubeGeo = new THREE.BoxGeometry(50, 50, 50);
            methodfollow(cubeGeo)
            cubeMaterial = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('./img/1.png')

            });
            break;
        case 2:
            cubeGeo = new THREE.SphereGeometry(50, 10, 10);
            methodfollow(cubeGeo)
            cubeMaterial = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('./img/3.jpg')
            });
            break;
        case 3:
            cubeGeo = new THREE.CubeGeometry(50, 100, 50);
            methodfollow(cubeGeo)
            cubeMaterial = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('./img/2.jpg')
            });
            break;
        case 4:
            cubeGeo = new THREE.CylinderBufferGeometry(25, 25, 100, 50, 50);
            methodfollow(cubeGeo)
            cubeMaterial = new THREE.MeshLambertMaterial({
                map: THREE.ImageUtils.loadTexture('./img/4.jpg')
            })
            break;

    }
}
function methodfollow(rollOverGeo) {
    // 这个几何对象是鼠标在移动时候，跟随鼠标显示的几何对象
    rollOverMaterial = new THREE.MeshBasicMaterial({color: 0xff0000, opacity: 0.5, transparent: true});
    //创建一个色彩为红色的材料，透明度为半透明
    rollOverMesh = new THREE.Mesh(rollOverGeo, rollOverMaterial);
    //通过mesh方法把颜色应用到几何对象上
    scene.add(rollOverMesh);
    //最后把该立方体对象添加到场景scene中
}

function onDocumentMouseMove(event) {
    //取消事件的默认动作
    event.preventDefault();
    //将鼠标点击位置的屏幕坐标转成threejs中的标准坐标;webgl把中心点设置为0，然后把世界坐标分成高（-1,1）之间，宽也如此
    mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
    //console.log(mouse)
    raycaster.setFromCamera(mouse, camera);
    //射线和模型求交，选中一系列直线   从相机所在位置到鼠标点击的位置的连线画一条射线，射线穿过的物体就会被拾取。
    var intersects = raycaster.intersectObjects(objects);
    if (isctrl) {
        console.log('sds');
        // create cube
    }
    ;
    if (intersects.length > 0) {//射线射中 底部的网格后会得到返回
        //获取对象
        var intersect = intersects[0];
        //copy会将rollOverMesh.position属性的内容替换成intersect.point，然后增加intersect.face.normal （面的法向量）
        rollOverMesh.position.copy(intersect.point).add(intersect.face.normal);
        //新建物体 按照向量定位位置
        rollOverMesh.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
    }
    render();

}

// function onDocumentMouseDown(event) {
//     console.log('sds')
//     event.preventDefault();
//     mouse.set((event.clientX / window.innerWidth) * 2 - 1, -(event.clientY / window.innerHeight) * 2 + 1);
//     raycaster.setFromCamera(mouse, camera);
//     var intersects = raycaster.intersectObjects(objects);
//     if (intersects.length > 0) {
//         var intersect = intersects[0];
//         // delete cube
//         if (isShiftDown) {
//             if (intersect.object != plane) {
//                 scene.remove(intersect.object);
//                 objects.splice(objects.indexOf(intersect.object), 1);
//             }
//             // create cube
//         } else {
//             var voxel = new THREE.Mesh(cubeGeo, cubeMaterial);
//             voxel.position.copy(intersect.point).add(intersect.face.normal);
//             voxel.position.divideScalar(50).floor().multiplyScalar(50).addScalar(25);
//             scene.add(voxel);
//             objects.push(voxel);
//         }
//         render();
//     }
// }

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }

    function onDocumentKeyDown(event) {
        switch (event.keyCode) {
            case 16:
                isShiftDown = true;
                break;
            case 17:
                isctrl = true;
                break;
        }
    }

    function onDocumentKeyUp(event) {
        switch (event.keyCode) {
            case 16:
                isShiftDown = false;
                break;
            case 17:
                isctrl = false;
                break;
        }

}


function createLights() {

    // 半球光就是渐变的光；
    // 第一个参数是天空的颜色，第二个参数是地上的颜色（光照会影响地上颜色  有坑），第三个参数是光源的强度
    hemisphereLight = new THREE.HemisphereLight(0xaaaaaa,0x000000, .9);

    // 环境光源修改场景中的全局颜色和使阴影更加柔和
    abc = new THREE.AmbientLight(0xdc8874, .5);

    // 方向光是从一个特定的方向的照射
    // 类似太阳，即所有光源是平行的
    // 第一个参数是关系颜色，第二个参数是光源强度
    shadowLight = new THREE.DirectionalLight(0xffffff, .9);

    // 设置光源的方向。
    // 位置不同，方向光作用于物体的面也不同，看到的颜色也不同
    shadowLight.position.set(150, 350, 350);

    // 开启光源投影
    shadowLight.castShadow = true;

    // 定义可见域的投射阴影
    shadowLight.shadow.camera.left = -400;
    shadowLight.shadow.camera.right = 400;
    shadowLight.shadow.camera.top = 400;
    shadowLight.shadow.camera.bottom = -400;
    shadowLight.shadow.camera.near = 1;
    shadowLight.shadow.camera.far = 1000;

    // 定义阴影的分辨率；虽然分辨率越高越好，吃性能选项，不要搞太变态就可以了
    shadowLight.shadow.mapSize.width = 2048;
    shadowLight.shadow.mapSize.height = 2048;

    scene.add(abc);
    // 为了使这些光源有效果体，需要将它们添加到场景中
    scene.add(hemisphereLight);
    scene.add(shadowLight);
}
