import mainpage from "../pages/main";
import homeDecoration from "../pages/home-decoration";
import storeInfo from "../pages/store-info";
import mini from "../pages/mini-program";
import MinDecoration from "../pages/mini-pro-decoration";
// import miniDecoration from "../pages/mini-program-decoration";

export default new VueRouter({
    mode: "hash",
    routes: [
        {
            path: '/',
            component: mainpage,
            redirect: '/mini',
            children: [
                {
                    path: '/storeInfo',
                    component: storeInfo
                },
                {
                    path: '/homeDecoration',
                    component: homeDecoration
                },
                {
                    path: '/mini',
                    component: mini
                },
                // {
                //     path: '/miniDecoration',
                //     component: miniDecoration
                // },
                {
                    path: '/miniDec',
                    component: MinDecoration
                },
            ],
        }

    ]
})

