import { expertReportTemplate } from "@/features/expert-reports/model";
import { Card, Bullet, H1, NavButton, Screen } from "@/ui/primitives";

export default function ExpertReportsScreen() {
  return (
    <Screen>
      <Card>
        <H1>토론 보고서 순서</H1>
        {expertReportTemplate.discussionSections.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <Card>
        <H1>전문가 역할</H1>
        {expertReportTemplate.expertRoles.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <Card>
        <H1>작업보고서 항목</H1>
        {expertReportTemplate.workReportSections.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <NavButton href="/" label="홈으로 돌아가기" />
    </Screen>
  );
}
