import React, { useState } from "react";
import {
  Brain,
  BookOpen,
  Target,
  CheckCircle2,
  Star,
  Layers,
  Trophy,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";

export function MomBeginnerReadingRoadmap() {
  const [expandedStep, setExpandedStep] = useState<number | null>(null);
  const [expandedParagraphs, setExpandedParagraphs] = useState<
    Record<string, boolean>
  >({});

  const toggleParagraph = (id: string) => {
    setExpandedParagraphs((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const readingPassage = [
    {
      id: "A",
      en: "Autism is an increasing dilemma in many countries around the world. Autism is a developmental disorder that impairs a person's ability to communicate and interact socially. According to the Center for Disease Control, the prevalence of autism rose by 5 to 15 per cent each year from 1990 to 2000. In 1990, it occurred in only 1 out of 150 children. By 2000, this figure had risen to 1 in 68.",
      vi: "Tự kỷ là một tình trạng tiến thoái lưỡng nan ngày càng tăng ở nhiều quốc gia trên thế giới. Tự kỷ là một rối loạn phát triển làm suy giảm khả năng giao tiếp và tương tác xã hội của một người. Theo Trung tâm Kiểm soát Dịch bệnh, tỷ lệ mắc bệnh tự kỷ đã tăng từ 5 đến 15% mỗi năm từ năm 1990 đến năm 2000. Năm 1990, bệnh chỉ xảy ra ở 1 trên 150 trẻ em. Đến năm 2000, con số này đã tăng lên 1 trên 68.",
    },
    {
      id: "B",
      en: "Autism is brought on by environmental and genetic factors. Environmental triggers include the use of dangerous substances, such as drugs or alcohol, by the mother during pregnancy. Also, measles infections during pregnancy have been linked to higher rates of autism. Scientists also know that heredity plays a key role, though no single gene has been conclusively connected to autism. An article by Daniel Geschwind reported that siblings of an autistic child are 25 times more likely to develop autism than the general population.",
      vi: "Tự kỷ do các yếu tố môi trường và di truyền gây ra. Các tác nhân môi trường bao gồm việc người mẹ sử dụng các chất nguy hiểm, chẳng hạn như ma túy hoặc rượu, trong thời kỳ mang thai. Ngoài ra, nhiễm trùng sởi trong thời kỳ mang thai có liên quan đến tỷ lệ tự kỷ cao hơn. Các nhà khoa học cũng biết rằng di truyền đóng một vai trò quan trọng, mặc dù không có một gen duy nhất nào được kết nối một cách thuyết phục với bệnh tự kỷ. Một bài báo của Daniel Geschwind đã báo cáo rằng anh chị em của một đứa trẻ tự kỷ có khả năng mắc bệnh tự kỷ cao gấp 25 lần so với dân số nói chung.",
    },
    {
      id: "C",
      en: "Because the symptoms of autism are highly variable, a variety of treatment methods are often necessary. Behavioural issues may require intensive training and the participation of the whole family. Also, specialised therapy is often necessary for improving speech and physical coordination. Finally, medicines can help related psychological problems, such as anxiety and depression.",
      vi: "Bởi vì các triệu chứng của bệnh tự kỷ rất khác nhau, một loạt các phương pháp điều trị thường là cần thiết. Các vấn đề về hành vi có thể yêu cầu đào tạo chuyên sâu và sự tham gia của cả gia đình. Ngoài ra, liệu pháp chuyên môn thường cần thiết để cải thiện lời nói và phối hợp thể chất. Cuối cùng, thuốc có thể giúp giải quyết các vấn đề tâm lý liên quan, chẳng hạn như lo âu và trầm cảm.",
    },
  ];

  const steps = [
    {
      step: "Tuần 1",
      title: "Nắm vững kỹ năng đọc hiểu căn bản",
      icon: <Target className="w-6 h-6 text-indigo-500" />,
      color: "border-indigo-200 bg-indigo-50 text-indigo-700",
      content:
        "Trước khi lao vào giải các dạng đề khó, bạn cần học cách xác định nội dung chính, đoán chủ đề qua từ khóa, tìm thông tin chi tiết, sắp xếp thông tin và xác minh tính xác thực của văn bản.",
      practice: (
        <div className="mt-6 border-t border-indigo-100/50 pt-6 animate-in fade-in slide-in-from-top-2">
          <div className="mb-4">
            <h4 className="font-bold text-slate-800 text-lg">
              Bài luyện: READING PASSAGE 1
            </h4>
            <p className="text-indigo-600 font-bold uppercase tracking-wider text-sm mt-1">
              Cause for Concern about Autism
            </p>
          </div>
          <div className="space-y-4">
            {readingPassage.map((para) => (
              <div
                key={para.id}
                className="bg-white rounded-xl border border-indigo-100 overflow-hidden shadow-sm hover:shadow-md transition-all"
              >
                <div className="flex items-start gap-4 p-5">
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center shrink-0 shadow-inner">
                    {para.id}
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-800 leading-relaxed font-serif text-lg">
                      {para.en}
                    </p>
                    {expandedParagraphs[para.id] && (
                      <div className="mt-5 p-5 bg-indigo-50/50 rounded-xl text-indigo-900 border border-indigo-100 animate-in fade-in slide-in-from-top-2 text-base leading-relaxed">
                        <strong className="block text-indigo-800 mb-2 uppercase text-xs tracking-widest flex items-center gap-2">
                          <Brain className="w-4 h-4" /> Dịch nghĩa
                        </strong>
                        {para.vi}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleParagraph(para.id);
                    }}
                    className="w-10 h-10 rounded-full bg-slate-50 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 flex items-center justify-center shrink-0 transition-all border border-slate-200 hover:border-indigo-200"
                  >
                    {expandedParagraphs[para.id] ? (
                      <Minus className="w-5 h-5" />
                    ) : (
                      <Plus className="w-5 h-5" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      step: "Tuần 2 & 3",
      title: "Giải quyết từng dạng bài (I & II)",
      icon: <Layers className="w-6 h-6 text-emerald-500" />,
      color: "border-emerald-200 bg-emerald-50 text-emerald-700",
      content:
        "Đi sâu vào tìm hiểu 10 dạng bài thường xuyên xuất hiện trong đề thi như: Multiple Choice, True/False/Not Given, Matching Headings... Bạn có thể áp dụng kiến thức để giải các câu hỏi thông qua Daily Check-up và Daily Test.",
    },
    {
      step: "Tuần 4",
      title: "Luyện bài thi thực tế",
      icon: <Trophy className="w-6 h-6 text-amber-500" />,
      color: "border-amber-200 bg-amber-50 text-amber-700",
      content:
        "Làm quen với các bài thi thử (Progressive Test) để ôn tập lại toàn bộ nội dung đã học, sau đó chuyển sang làm các bài thi thật (Actual Test).",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
      <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-8 rounded-3xl text-white shadow-md relative overflow-hidden">
        <div className="absolute right-0 top-0 opacity-10 translate-x-1/4 -translate-y-1/4">
          <BookOpen className="w-48 h-48" />
        </div>
        <div className="relative z-10">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Lộ trình 4 tuần chinh phục IELTS Reading
          </h2>
          <p className="text-emerald-50 max-w-2xl text-lg leading-relaxed">
            Sách chia quá trình học thành 4 giai đoạn cụ thể để bạn xây dựng từ
            nền tảng đến kỹ năng thực chiến.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6">
              4 Giai đoạn học tập
            </h3>
            <div className="space-y-4">
              {steps.map((step, idx) => {
                const isExpanded = expandedStep === idx;
                return (
                  <div
                    key={idx}
                    className={`rounded-2xl border transition-all ${
                      isExpanded
                        ? `${step.color.replace("bg-", "bg-opacity-10 bg-")} border-indigo-200 shadow-md`
                        : `${step.color.replace("bg-", "bg-opacity-50 bg-")} hover:bg-opacity-30 cursor-pointer`
                    }`}
                  >
                    <div
                      className={`p-5 flex items-center justify-between cursor-pointer ${isExpanded ? "border-b border-indigo-100/50" : ""}`}
                      onClick={() => setExpandedStep(isExpanded ? null : idx)}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-12 h-12 rounded-xl flex items-center justify-center ${step.color.split(" ")[1]}`}
                        >
                          {step.icon}
                        </div>
                        <div>
                          <span
                            className={`inline-block px-2 py-1 rounded-md text-[10px] font-black uppercase tracking-wider mb-1 ${step.color.replace("border-", "bg-white border-")}`}
                          >
                            {step.step}
                          </span>
                          <h4 className="font-bold text-slate-800 leading-tight">
                            {step.title}
                          </h4>
                        </div>
                      </div>
                      <ChevronDown
                        className={`w-5 h-5 text-slate-400 transition-transform ${isExpanded ? "rotate-180 text-indigo-600" : ""}`}
                      />
                    </div>
                    {isExpanded && (
                      <div className="p-5 pt-4 bg-white/50 rounded-b-2xl animate-in fade-in slide-in-from-top-2">
                        <p className="text-sm text-slate-600 leading-relaxed">
                          {step.content}
                        </p>
                        {step.practice}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
              <Brain className="w-6 h-6 text-indigo-500" />
              Chiến thuật làm bài (Multiple Choice)
            </h3>
            <div className="space-y-4">
              {[
                {
                  title: "Đọc yêu cầu đề bài",
                  desc: "Xác định rõ số lượng đáp án cần chọn.",
                },
                {
                  title: "Xác định từ khóa",
                  desc: "Phân tích từ khóa và nội dung câu hỏi trước khi bắt đầu đọc bài văn.",
                },
                {
                  title: "Định vị thông tin",
                  desc: "Tìm vị trí của nội dung liên quan trong bài đọc. Lưu ý paraphrase.",
                },
                {
                  title: "Lựa chọn đáp án",
                  desc: "Dựa vào nội dung vừa xác định để chọn câu trả lời đúng.",
                },
                {
                  title: "Nhận biết bẫy",
                  desc: "Loại trừ phương án sai phổ biến (sai ý nghĩa, không xuất hiện, hoặc trái ngược).",
                },
              ].map((item, idx) => (
                <div
                  key={idx}
                  className="flex gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100"
                >
                  <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold shrink-0">
                    {idx + 1}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{item.title}</h4>
                    <p className="text-sm text-slate-600 mt-1">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-rose-500" />
                Kỹ năng cốt lõi
              </h3>
              <ul className="space-y-3 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Skimming & Scanning</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Paraphrase</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Mở rộng từ vựng</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>Đa dạng chủ đề</span>
                </li>
              </ul>
            </div>

            <div className="bg-gradient-to-br from-amber-100 to-orange-100 p-6 rounded-3xl shadow-sm border border-amber-200">
              <h3 className="text-lg font-bold text-amber-900 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-600" />
                Tối ưu điểm
              </h3>
              <div className="space-y-4 text-sm text-amber-800">
                <div>
                  <strong className="block text-amber-900 mb-1">
                    Dịch & Giải thích:
                  </strong>
                  Sách có dịch toàn bộ và giải thích chi tiết.
                </div>
                <div>
                  <strong className="block text-amber-900 mb-1">
                    Canh thời gian:
                  </strong>
                  Tối đa 60 phút để làm quen áp lực thi.
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
