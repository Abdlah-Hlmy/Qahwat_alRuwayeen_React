import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faFacebook,
  faWhatsapp,
  faTelegram,
} from '@fortawesome/free-brands-svg-icons';
import Navbar from '../components/Navbar';
import { Link } from 'react-router-dom';
import Footer from '../components/Footer';

const AboutUs = () => {
  return (
    <>
      <div className="min-h-[100vh] bg-slate-100">
        <Navbar />
        <div className="container pt-[85px] px-3">
          <div className="flex justify-between items-start">
            <div className="text-sm">
              <Link to="/" className="text-orange-800 font-semibold">
                الرئيسية
              </Link>{' '}
              / من نحن
            </div>{' '}
            <div className="flex justify-center gap-3">
              <a
                href="https://www.facebook.com/groups/845315093060311"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faFacebook}
                  className="text-blue-600 transition-all hover:text-blue-700 text-[28px]"
                />
              </a>
              <a
                href="https://chat.whatsapp.com/KVnzC1btSR73Ai8x1JqCMs"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faWhatsapp}
                  className="text-green-500 transition-all hover:text-green-600 text-[28px]"
                />
              </a>
              <a
                href="https://t.me/novelrsqahwa"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FontAwesomeIcon
                  icon={faTelegram}
                  className="text-blue-500 transition-all hover:text-blue-600 text-[28px]"
                />
              </a>
            </div>
          </div>
          <h2 className="text-2xl font-semibold mb-4 mt-2">من نحن</h2>
          <p className="text-lg text-gray-800 leading-relaxed bg-white p-6 rounded-md border">
            <span className="font-semibold block text-brown-700">
              قهوة الروائيين{' '}
            </span>
            مكان يجتمع به القارئ والكاتب، يهدف لمساعدة أي شخص لديه موهبة الكتابة
            وتطويره حتىٰ يصل لهدفه عن طريق فقرات علىٰ مدار الأسبوع لمشاركة
            الخواطر والنصوص وأيضًا الارتجالات، ومساعدة كُل قارئ في العثور علىٰ
            الكثير من الكتب والروايات التي ستنال اعجاب ذوقه عن طريق المُراجعات
            المميزة التي يُقدمها مسؤول المجموعة بجانب العديد من الأعضاء المميزين
            وأيضًا يسمح لأي قارئ بمشاركة آرائه ومُراجعاته ما لم تنتهك معايير
            فيسبوك وقوانين الجروب.
          </p>
          <div className="flex gap-4 mt-4 max-md:flex-col">
            <div className="w-full md:w-1/2 bg-white p-4 rounded-md border">
              <h2 className="text-2xl font-semibold text-orange-700 text-center mb-2">
                رؤيتنا
              </h2>
              <p className="text-lg text-gray-800 px-2">
                نطمح لأن نكون المرجع الأول للكتّاب والقُرّاء في العالم العربي،
                حيث نوفر لهم بيئة تفاعلية تساهم في تطوير مهاراتهم الأدبية وتنمية
                ثقافتهم.
              </p>
            </div>
            <div className="w-full md:w-1/2 bg-white p-4 rounded-md border">
              <h2 className="text-2xl font-semibold text-center text-orange-700 mb-2">
                أهدافنا
              </h2>
              <ul className="text-lg text-gray-800 list-disc list-inside">
                <li className="mb-2">
                  توفير منصة لنشر الأعمال الأدبية الجديدة.
                </li>
                <li className="mb-2">تشجيع القراءة وتنمية المجتمع الأدبي.</li>
                <li className="mb-2">
                  مساعدة الكتاب الجدد في صقل مهاراتهم وتطويرها.
                </li>
                <li className="mb-2">
                  إقامة ورش عمل وجلسات نقاشية حول الأدب والثقافة.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;
