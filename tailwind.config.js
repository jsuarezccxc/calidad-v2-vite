module.exports = {
    purge: ['./src/**/*.{js,jsx,ts,tsx}', './public/index.html'],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            boxShadow: {
                modal: '4px 4px 6px rgba(11, 44, 76, 0.6)',
                select: '2px 2px 4px rgba(0, 0, 0, 0.25)',
                template: '0 3px 4px rgba(0, 0, 0, 0.15)',
                blogArticle: '0 2px 4px rgba(11, 44, 73, 0.3)',
                templateDesign: '0 4px 4px rgba(0, 0, 0, 0.25)',
                cardArticle: '0 4px 4px rgba(0,0,0 0.15)',
                cardUserBilling: ' 0px 4px 21px rgba(0, 0, 0, 0.25);',
                card: '0rem 0.25rem 0.25rem 0rem rgba(0, 0, 0, 0.25)',
                newMemberships: '0 0.25rem 0.625rem rgba(0, 171, 158, 0.25)',
            },
            zIndex: {
                '1': '1',
            },
            space: {
                '4.5': '1.125rem', // 18px
            },
            colors: {
                blue: {
                    DEFAULT: '#0B2C4C',
                    light: '#0B2C4C26',
                },
                green: {
                    dark: '#068D84',
                    DEFAULT: '#00A99D',
                    light: '#02BAAD',
                    ultraLight: 'rgba(2, 186, 173, 0.27)',
                    extraLight: '#00A99D26',
                    semiDark: '#01746C',
                    neutral: '#46E50D',
                    bgLight: '#D9F2F0',
                },
                purple: {
                    DEFAULT: '#81319B',
                    dark: '#5E1B74',
                    light: '#C58ED7',
                    smooth: '#81319B24',
                },
                gray: {
                    background: '#EFF0F2',
                    dark: '#4B4B4B',
                    DEFAULT: '#AEAEAF',
                    light: '#F4F4F4',
                    smooth: '#E9E9E9',
                    neutral: '#F2F2F2',
                    lighter: '#D0E7E5',
                    softLight: '#E9E9E9',
                    otherGray: '#DBDBDE',
                    grayBlue: '#DADFE4',
                    blocking: '#7F7F7F',
                    smoke: '#D9D9D9',
                    box: '#DDDDDD',
                    soft: '#7A8082',
                },
                orange: {
                    DEFAULT: '#F6846B',
                },
                red: {
                    DEFAULT: '#F44C4D',
                    notification: '#FF0F00',
                },
                black: {
                    DEFAULT: '#212121',
                },
                magicPink: {
                    DEFAULT: '#D299E4',
                },
            },
            backgroundPosition: {
                'right-center': 'right 0.5rem center',
            },
            minHeight: {
                '2': '2rem',
                '6.75': '1.6875rem', //27px
                '7.5': '1.8125rem', //29px
                '8': '1.875rem', //30px
                '8.4': '2.0625rem', //33px
                '8.75': '2.188rem', //35px
                '8.76': '2.313rem', //37px
            },
            maxHeight: {
                '8.5': '2.1875rem', //35px
                '23.2': '5.875rem', // 94px
                '34': '8.25rem', //132px
            },
            fontFamily: {
                aller: ['Aller'],
                allerbold: ['AllerBold'],
                montserrat: ['Montserrat'],
                montserratbold: ['MontserratBold'],
                roboto: ['Roboto'],
                robotobold: ['RobotoBold'],
                opensans: ['OpenSans'],
                opensansbold: ['OpenSansBold'],
                lato: ['Lato'],
                latobold: ['LatoBold'],
                barlow: ['Barlow'],
                barlowbold: ['BarlowBold'],
                firasans: ['FiraSans'],
                firasansbold: ['FiraSansBold'],
                epilogue: ['Epilogue'],
                epiloguebold: ['EpilogueBold'],
                librefranklin: ['LibreFranklin'],
                librefranklinbold: ['LibreFranklinBold'],
                archivo: ['Archivo'],
                archivobold: ['ArchivoBold'],
                raleway: ['Raleway'],
                ralewaybold: ['RalewayBold'],
                poppins: ['Poppins'],
                poppinsmedium: ['PoppinsMedium'],
                poppinssemibold: ['PoppinsSemiBold'],
                blue: '#0B2C4C',
                green: '#00A99D',
                purple: '#81319B',
                'purple-smooth': '#81319B24',
                gray: '#AEAEAF',
                'gray-dark': '#212121',
                'gray-light': '#F2F2F2',
                poppinsbold: ['PoppinsBold'],
            },
            fontSize: {
                '2xl': '2rem', //32px
                '28lg': '1.75rem', //28px
                '26lg': '1.625rem', //26px
                '1.5xl': '1.5rem', //24px
                xl: '1.375rem', //22px
                '2lg': '1.25rem', //20px
                '2.1lg': '1.3125rem', //21px
                lg19: '1.1875rem', //19px
                lg: '1.125rem', //18px
                slg: '1.122rem', //17.95px
                mlg: '1.063rem', //17px
                base: '1rem', // 16px
                '15px': '0.9375rem', // 15px
                sm: '0.875rem', // 14px
                xs: '0.8125rem', // 13px
                tiny: '0.75rem', // 12px
                mtiny: '0.688rem', // 11px
                xtiny: '0.625rem', // 10px
                ntiny: '0.5625rem', // 9px
                xntiny: '0.5rem', // 8px
                title: '3.4375rem', // 55px
                'hero-title': '4.375rem', // 70px
            },
            lineHeight: {
                '2xl': '2.25rem', //36px
                xl: '1.663rem', //26.6px
                '5.25': '1.3125rem', //21px
                '2lg': '1.514rem', //24.22px
                lg: '1.363rem', //21.8px
                base: '1.213rem', //19.4px
                '16.95px': '1.059375rem', //16.95px
                '4.5': '1.125rem', // 18px
                '19.38px': '1.21125rem', //19.38px
                '7.2': '1.875rem',
                sm: '1.0625rem', // 17px
                xs: '0.906rem', //14.5px
                tiny: '0.875rem', //14px
                mtiny: '0.833rem', // 13.32px
                xtiny: '0.75rem', //12px
                stiny: '0.9375rem', // 15px
                '15.74': '0.98375rem', // 15.74px
            },
            margin: {
                '0': '0rem', // 0px
                '0.5': '0.125rem', // 2px
                '1.3': '0.219rem', //3.5px
                '1.4': '0.25rem', //4px
                '1.5': '0.375rem', // 6px
                '1.8': '0.438rem', // 7px
                '7.5': '0.46875rem', // 7.5px
                '7.8': '0.563rem', // 9px
                '2': '0.5rem', // 8px
                '2.2': '0.625rem', // 10px
                '2.75': '0.6875rem', // 11px
                '3': '0.75rem', // 12px
                '3.25': '0.8125rem', // 13px
                '4.4': '1.25rem', // 20px
                '3.75': '0.9375rem', // 15px
                '4.55': '1.0625rem', // 17px
                '4.5': '1.125rem', // 18px
                '4.75': '1.1875rem', // 19px
                '5.5': '1.375rem', // 22px
                '6.25': '1.5625rem', // 25px
                '6.70': '1.625rem', // 26px
                '6.75': '1.6875rem', //27px
                '8.4': '1.75rem', // 28px
                '8.5': '1.813rem', // 29px
                '7.3': '1.875rem', //30px
                '7.4': '1.938rem', //31px
                '9.3': '2.125rem', // 34px
                '9.5': '2.375rem', // 38px
                '10.5': '2.625rem', // 42px
                '11.25': '2.8125rem', //45px,
                '11.5': '2.875rem', //46px,
                '13': '3.25rem', // 52px
                '14.75': '3.6875rem', //59px,
                '17.5': '4.375rem', // 70px
                '17': '4.6rem', // 73.6px
                '18.75': '4.6875rem', // 75px
                '21': '5.25rem', // 84px
                '21.75': '5.4375rem', // 87px
                '29.25': '7.3125rem', // 117px
                '28.5': '7.6rem', // 121.6px
                '35.25': '8.8125rem', // 141px
                '47': '11.75rem', // 188px
                '60.25': '15.063rem', //241px
                '61.25': '15.3125rem', // 245px
                '116': '29rem', // 464px
                '82': '22rem', // 352px
                '89.35': '22.938rem', // 367px
                '94.25': '23.5625rem', // 377px
                '67.5': '4.21875', //67.5px
                '-4.5': '-1.125rem', // -18px
            },
            padding: {
                '0.25': '0.06255rem', // 1px
                '0.375': '0.09375rem', // 1.5px
                '0.5': '0.125rem', // 2px
                '0.75': '0.1875rem', // 3px
                '0.875': '0.21875rem', // 3.5px
                '1.25': '0.3125rem', // 5px
                '1.875': '0.46875rem', // 7.5px
                '2.25': '0.5625rem', // 9px
                '2.375': '0.59375rem', // 9.5px
                '2.75': '0.6875rem', // 11px
                '3.25': '0.8125rem', // 13px
                '3.5': '0.875rem', // 14px
                '3.75': '0.9375rem', // 15px
                '4.25': '1.0625rem', // 17px
                '4.5': '1.125rem', //18px
                '5.5': '1.375rem', // 22px
                '6.70': '1.625rem', // 26px
                '7.3': '1.875rem', //30px
                '8.25': '2.0625rem', // 33px
                '6.4': '2.125rem', // 34px
                '10.5': '2.625rem', // 42px
                '11.5': '2.875rem', //46px,
                '13.75': '3.438rem', // 55px
                '51': '3.1875rem', // 51px
                '13': '3.25rem', // 52px
                '13.25': '3.3125rem', // 53px
                '14.5': '3.625rem', //58px,
                '16.5': '4.125rem', // 66px
                '68px': '4.25rem', //68px,
                '75': '4.6875rem', // 75px
                '21.75': '5.4375rem', // 87px
                '22.125': '5.53125rem', // 88.5px
                '22.5': '5.625rem', // 90px
                '115': '28.75rem', // 460px
                '68': '18rem', // 288px
            },
            gap: {
                '1.9': '0.5625rem', // 9px
                '3.75': '0.9375rem', // 15px
                '4.5': '1.125rem', // 18px
                '5.5': '1.375rem', // 22px
                '6.4': '2.125rem', // 34px
            },
            minWidth: {
                'min-mi': '31.75rem', //508px
                '44': '11rem', //176px
                '180': '43.75rem', //700
                '224': '56.25rem', //900px
                '19.25': '4.8125rem', // 77px
                login: '26.75rem', // 428px
                loader: '9.75rem', // 156px
            },
            width: {
                '3/7': '53.%',
                '11/11': '95%',
                '4/9': '44.4%',
                '0.25': '0.0625rem', // 1px
                '1.5': '0.375rem', // 6px
                '1.6': '0.591rem', //9.45px,
                '4.25': '1.0625rem', //17px
                '4.5': '1.125rem', //18px
                '5': '1.25rem', // 20px
                '5.5': '1.375rem', //22px
                '6.75': '1.6875rem', //27px,
                '7.5': '1.875rem', //30px,
                '8.5': '2.116rem', //33.85px,
                '8.7': '2.375rem', //38px,
                '8.75': '2.4375rem', //39px,
                '9.1': '2.625rem', //42px,
                '9.2': '2.831rem', //45.3px,
                '9.4': '3.068rem', //49.08px,
                '9.8': '3.468rem', //55,48px,
                '10.5': '2.625rem', //42px,
                '11.2': '2.875rem', //46px
                '12.5': '3.125rem', //50px,
                '16.5': '4.125rem', //66px
                '17.8': '4.24rem', // 67.84px
                '17.5': '4.375rem', // 70px
                '18.75': '4.6875rem', // 75px
                '19.25': '4.8125rem', // 77px
                '19': '4.3rem', //68.8px
                '19.3': '4.375rem', //70px
                '19.4': '4.479rem', //71.67px
                '19.5': '4.518rem', //72.28px
                '19.9': '4.938rem', //79.008px
                '20.4': '5.25rem', //84px
                '21.8': '5.375rem', //86px
                '22': '5.563rem', // 89px
                '22.2': '5.625rem', // 90px
                '22.3': '5.688rem', // 91px
                '22.6': '5.875rem', // 94px
                '22.7': '5.913rem', // 94px
                '25': '6.375rem', //96px
                '25.1': '6.063rem', //97px
                '25.2': '6.125rem', //98px
                '25.3': '6.1875rem', //99px
                '25.5': '6.25rem', //100px
                '25.6': '6.375rem', //102px
                '25.7': '6.406rem', //103px
                '26': '6.5rem', //104px
                '26.2': '6.688rem', //107px
                '26.3': '6.625rem', //106px
                '26.4': '6.813rem', //109.008px
                '26.5': '6.875rem', //110px
                '27': '6.9rem', // 110.4px
                '28.2': '7.063rem', // 113px
                '28.5': '7.25rem', // 116px
                '28.6': '7.313rem', // 117px
                '28.7': '7.125rem', //114px
                '28.8': '7.438rem', //119.04px
                '29': '7.5rem', // 120px
                '30': '7.625rem', // 122px
                '30.2': '7.671rem', //122,73px
                '30.6': '7.875rem', //126px
                '30.7': '7.938rem', //127px
                '32.4': '8.125rem', //130px
                '32.5': '8.2rem', // 131.2px
                '32.7': '8.1875rem', // 131px
                '32.8': '8.25rem', // 132px
                '32.9': '8.313rem', // 133px
                '33.1': '8.556rem', // 136,96px
                '33.4': '8.630rem', // 138.08px
                '34': '8.8125rem', // 141px
                '34.3': '8.4375rem', //135px
                '34.4': '8.5rem', // 136px
                '34.5': '8.625rem', // 138px
                '34.6': '8.688rem', //139.008px
                '34.7': '8.698rem', // 139.168px
                '35': '8.7rem', // 140.2px
                '35.5': '8.86rem', // 141.76px
                '35.25': '9rem', // 144px
                '36': '9.0625rem', // 145px
                '36.25': '9.125rem', // 146px
                '36.5': '9.25rem', // 148px
                '36.6': '9.313rem', // 149.008px
                '37': '9.375rem', // 150px,
                '37.5': '9.4375rem', // 151px,
                '38': '9.625rem', // 154px,
                '38.2': '9.6875rem', // 155px,
                '38.4': '9.8125rem', // 157px,
                '38.5': '9.875rem', // 158px,
                '38.8': '9.938rem', // 159px,
                '39': '10rem', // 160px,
                '40': '10.25rem', // 164px,
                '40.5': '10.125rem', // 162px
                '40.52': '10.192rem', // 163px
                '40.56': '10.4375rem', // 167px
                '40.60': '10.6875rem', // 171px
                '40.80': '10.875rem', // 174px
                '41': '10.9375rem', // 175px
                '44': '11.188rem', // 179px
                '41.5': '10.400rem', // 167px,
                '42': '10.5rem', // 168px,
                '44.25': '11.25rem', // 180px
                '44.27': '11.375rem', // 182px
                '44.1': '11.188rem', // 179px
                '44.2': '11.5rem', // 184px
                '44.3': '11.563rem', // 185px
                '44.4': '11.623rem', // 185.96px
                '44.5': '11.125rem', // 178px∆
                '44.6': '11.19rem', // 179.04px
                '44.7': '11.063rem', // 177.008px
                '45': '11.25rem', // 180px
                '46.5': '11.625rem', // 186px
                '46.6': '11.660rem', // 186.56px
                '45.2': '11.31rem', // 180.96px
                '47.5': '11.875rem', // 190px
                '48': '12.125rem', // 194px
                '48.2': '12rem', // 194px
                '48.4': '12.125rem', // 194px
                '48.5': '12.2rem', // 195.2px
                '49.5': '12.375rem', // 198px
                '49': '12.5rem', // 200px
                '49.4': '12.525rem', //200.4px
                '51': '12.6rem', // 201.6px
                '51.3': '12.75rem', //204px
                '51.25': '12.8125rem', //205px,
                '51.5': '12.875rem', // 206px
                '52.5': '13.25rem', // 212px
                '53': '13.375rem', //214px
                '55': '13.75rem', // 220px
                '55.4': '13.8125rem', // 221px
                '55.5': '13.875rem', // 222px
                '56': '14.125rem', // 226px
                '57.5': '14.375rem', // 230px
                '57': '14.625rem', // 234px
                '57.2': '14.800rem', // 236.8px
                '57.4': '14.908rem', // 238.528px
                '59': '15.0625rem', // 241px
                '60.75': '15.1875rem', // 243px
                '59.5': '15.25rem', // 244px
                '61': '15.375rem', // 246px
                '62': '15.5rem', // 248px
                '63': '16.25rem', // 260px
                '65': '16.375rem', // 262px
                '65.5': '15.721rem', //251.54px
                '68': '17rem', // 272px
                '66.5': '16.625rem', // 266px
                '70.5': '16.75rem', // 268px
                '71.2': '17.375rem', // 278px
                '70': '17.5rem', //280px
                '71.9': '17.75rem', //284px
                '73': '18.125rem', // 290px
                '76': '18.75rem', // 300px
                '77.25': '19.3125rem', // 309px
                '79.25': '19.8125rem', // 317px
                '77': '19.875rem', // 318px
                '81': '20.25rem', // 324px
                '81.5': '20.375rem', // 326px
                '83': '20.75rem', // 332px
                '84.9': '20.9378rem', // 335px
                '85': '21rem', // 336px
                '85.5': '21.5rem', // 344px
                '86': '22.5rem', // 360px
                '86.9': '23.563rem', //377
                '87': '23.875rem', // 382px
                '96.5': '24.255rem', // 386px
                '87.5': '24.625rem', // 394px
                '88': '24.68rem', // 395px
                '100': '25rem', // 400px
                '103.75': '25.9375rem', // 415px
                '89': '26rem', // 416px
                '89.2': '26.2rem', // 419.2px
                '90': '26.75rem', // 428px
                '97': '25rem', // 432px
                '108.25': '27.0625rem', // 433px
                '110.75': '27.687rem', // 443px
                '111.5': '27.875rem', // 446px
                '117': '28.75rem', // 460px
                '119.5': '30rem', // 480px
                '120': '31.25rem', // 500px
                '120.9': '31.75rem', // 508px
                '121': '31.8125rem', // 509px
                '130': '32.68rem', // 523px
                '132': '33.0625rem', // 528px
                '141': '35.625rem', //570px
                '144': '36rem', //576px
                '144.25': '36.0625rem', //577px
                '145': '36.25rem', //580px
                '148': '37rem', //592px
                '148.6': '37.375rem', //598px
                '151': '37.75rem', //604px
                '151.50': '38rem', //608
                '151.4': '37.875rem', //606px
                '152.25': '38.0625rem', //609px
                '153': '38.25rem', //612px
                '153.5': '38.4375rem', //615px
                '158.5': '39.625rem', //634px
                '160.75': '40.1875rem', //643px
                '162.5': '40.6255rem', //650px
                '164': '41rem', //656px
                '168.75': '42.1875rem', //675px
                '175': '43.75rem', //700px
                '176': '46.125rem', //735px
                '187': '48.9375rem', //783px
                '202.5': '50.625rem', //810px
                '219': '55rem', //880px
                '223.5': '55.875rem', //894px
                '224': '56.25rem', //900px
                '226': '58.875rem', //942px
                '231': '60.188rem', //963px
                'min-mi': '31.75rem', //508px
                'max-mi': '48.875rem', //782px
            },
            maxWidth: {
                '70': '17.5rem', //280px
                '129.9': '31.75rem', //508px
                '170': '42.5625rem', //681px
                '180': '43.75rem', //700px
                'max-mi': '48.875rem', //782px
                'max-table': '45.25rem', //724px
                '207.5': '51.9375rem', //831px
                '224': '56rem', //896px
                '225': '58rem', //928px
                '226': '58.875', //942px
            },
            height: {
                '1.5': '0.375rem', // 6px
                '4.23': '0.9375rem', //15px
                '4.25': '1.0625rem', //17px
                '4.5': '1.125rem', //18px
                '5.25': '1.3125rem', //21px
                '5.5': '1.375rem', //22px
                '5.75': '1.4375rem', //23px
                '5.85': '1.439rem', //23.02px
                '6.1': '1.938rem', //31px
                '6.25': '1.438rem', //36px
                '6.255': '1.440rem', //36.5px
                '6.5': '1.6rem', //26px
                '6.75': '1.6875rem', //27px,
                '6.8': '1.688rem', //27.008px,
                '6.9': '1.813rem', //29px,
                '7.125': '1.78125rem', //28.5px
                '8.2': '1.875rem', // 30px
                '8.3': '1.9375rem', // 31px
                '33px': ' 2.0625rem', //33px,
                '8.5': '2.116rem', //33.85px,
                '8.6': '2.125rem', //34px
                '8.75': '2.188rem', //35px
                '8.9': '2.313rem', //37px,
                '38px': '2.375rem', //38px,
                '10.5': '2.688rem', //43px
                '9.25': '2.3125rem', //37px,
                '9.5': '2.375rem', //38px,
                '9.675': '2.425rem', //38.8px,
                '9.870': '2.438rem', //39,008px,
                '9.75': '2.4375rem', //39px,
                '9.875': '2.46875rem', //39.5px,
                '12.5': '3.125rem', //50px,
                '13': '3.25rem', //52px,
                '13.75': '3.4375rem', //55px,
                '14.25': '3.5625rem', // 57px
                '15': '3.75rem', // 60px
                '15.75': '3.9375rem', // 63px
                '17.1': '4.3125rem', // 69px
                '17.5': '4.375rem', // 70px
                '18': '4.4625rem', //71.416px,
                '18.75': '4.6875rem', //75px,
                '22': '5.087rem', //81.4px,
                '22.25': '5.5625rem', //89px,
                '22.2': '5.625rem', // 90px
                '23': '5.75rem', // 92px
                '25': '6.188rem', //99px,
                '28.3': '7.3125rem', //117px
                '29': '7.5rem', //120px,
                '36.5': '9.125rem', //146px,
                '37': '9.25rem', //148px,
                '38': '9.5rem', //152px,
                '45': '11.25rem', //180px,
                '50': '12.5rem', //200px,
                '53': '12.6875rem', //203px,
                '51.25': '12.8125rem', //205px,
                '51.75': '12.9375rem', //207px,
                '59.25': '14.8125rem', //237px,
                '69.25': '17.3125rem', // 277px
                '75': '18.75rem', // 300px
                '77': '19.875rem', // 318px
                '82': '20.125rem', // 322px
                '87': '23.62rem', // 378px
                '88.5': '24.25rem', // 388px
                '110': '25rem', // 400px
                '112': '27rem', // 432px
                '112.5': '28.125rem', // 450px
                '118': '29.188', // 467
                '120': '30rem', // 480px
                '123': '32rem', // 512px
                '125': '35rem', // 560px
                '156': '39rem', // 624px
                '151': '41.875rem', // 670px
                '161.25': '40.3125rem', // 645px
                '152': '42.563rem', // 681px
                '158': '43rem', // 688px
                '703': '43.9375rem', // 703px
                '159': '45rem', // 720px
                '160': '47rem', // 752px
                '830': '51.875rem', // 830px
                '600': '150rem', // 2400px
            },
            borderWidth: {
                '0.5': '0.03125rem',
                '1.1': '0.0688rem',
                '1': '0.0625rem',
                '1.2': '0.063rem',
                '1.25': '0.094rem',
                '1.3': '0.125rem',
                '1.4': '0.188rem',
            },
            borderRadius: {
                '1xlg': '0.625rem', //10px
                '2.5xl': '1.125rem', //18px
            },
            animation: {
                'show-modal': 'showModal ease 600ms',
                'leave-modal': 'leaveModal ease forwards 600ms',
                'loader-modal': 'loaderModal .5s cubic-bezier(0.165, 0.840, 0.440, 1.000) forwards',
                'loader-spin': 'loaderSpin 3s infinite',
            },
            keyframes: {
                showModal: {
                    from: {
                        opacity: '0',
                    },
                    to: {
                        opacity: '1',
                    },
                },
                leaveModal: {
                    from: {
                        opacity: '1',
                    },
                    to: {
                        opacity: '0',
                    },
                },
                loaderModal: {
                    from: {
                        transform: 'scale(0)',
                    },
                    to: {
                        transform: 'scale(1)',
                    },
                },
                loaderSpin: {
                    from: {
                        transform: 'rotate(0deg)',
                    },
                    to: {
                        transform: 'rotate(360deg)',
                    },
                },
            },
            screens: {
                small: { min: '350px', max: '398px' },
                mn: { min: '399px', max: '836px' },
                ms: { min: '635px', max: '1023px' },
                xs: { max: '767px' },
                lgx: { max: '1256px', min: '1024px' },
                lgm: { max: '1265px' },
                xlg: { min: '1281px' },
            },
            spacing: {
                '16.5': '4.5rem', //72px
                '47': '11.75rem', //188px,
                '137.5': '34.375rem', //550px,
                '140': '35rem', //560px,
                '150': '37.5rem', //600px,
                '200': '50rem', //800px,
                '287.5': '71.875rem', //1150px,
            },
        },
    },
    variants: {
        extend: {
            borderColor: ['responsive', 'focus'],
            backgroundColor: ['responsive', 'hover', 'disabled', 'first'],
            borderRadius: ['hover', 'focus'],
            borderWidth: ['last', 'first', 'even'],
            margin: ['first', 'last'],
            width: ['first'],
            display: ['group-hover'],
        },
    },
    plugins: [],
};
