import { sampleParentReport } from "@/features/parent/model";
import { Card, Body, Bullet, H1, NavButton, Screen } from "@/ui/primitives";

export default function ParentScreen() {
  return (
    <Screen>
      <Card>
        <H1>부모 학습 리포트</H1>
        <Body>{sampleParentReport.sessionSummary}</Body>
      </Card>

      <Card>
        <H1>자주 막힌 개념</H1>
        {sampleParentReport.blockedConcepts.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <Card>
        <H1>다음 추천</H1>
        {sampleParentReport.nextRecommendations.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <NavButton href="/" label="홈으로 돌아가기" />
    </Screen>
  );
}
