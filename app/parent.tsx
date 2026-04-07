import { useEffect, useState } from "react";
import { listParentReports } from "@/features/parent/api";
import { sampleParentReport } from "@/features/parent/model";
import { hasPublicSupabaseEnv } from "@/lib/supabase/env";
import {
  ActionButton,
  Card,
  Body,
  Bullet,
  Caption,
  H1,
  NavButton,
  Screen,
} from "@/ui/primitives";

export default function ParentScreen() {
  const [reports, setReports] = useState([sampleParentReport]);
  const [status, setStatus] = useState(
    "부모 로그인 후 원격 리포트를 조회하면 샘플 대신 실데이터가 보인다.",
  );
  const [isBusy, setIsBusy] = useState(false);

  async function loadReports() {
    try {
      setIsBusy(true);
      const nextReports = await listParentReports();
      if (nextReports.length > 0) {
        setReports(nextReports);
      }
      setStatus(
        nextReports.length > 0
          ? `${nextReports.length}개의 부모 리포트를 불러왔다.`
          : "원격 리포트가 없어 샘플 리포트를 유지한다.",
      );
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "리포트를 읽지 못했다.");
    } finally {
      setIsBusy(false);
    }
  }

  useEffect(() => {
    if (!hasPublicSupabaseEnv()) {
      return;
    }

    loadReports();
  }, []);

  const latestReport = reports[0] ?? sampleParentReport;

  return (
    <Screen>
      <Card>
        <H1>부모 학습 리포트</H1>
        <Body>{latestReport.sessionSummary}</Body>
        <Caption>
          {hasPublicSupabaseEnv()
            ? "로그인한 부모 계정의 session_reports를 직접 조회한다."
            : "공개 Supabase 설정이 없어 샘플 리포트만 표시된다."}
        </Caption>
      </Card>

      <Card>
        <H1>자주 막힌 개념</H1>
        {latestReport.blockedConcepts.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <Card>
        <H1>다음 추천</H1>
        {latestReport.nextRecommendations.map((item) => (
          <Bullet key={item}>{item}</Bullet>
        ))}
      </Card>

      <Card>
        <H1>원격 리포트 새로고침</H1>
        <ActionButton
          label="실데이터 다시 불러오기"
          variant="secondary"
          disabled={isBusy || !hasPublicSupabaseEnv()}
          onPress={loadReports}
        />
        <Body>{status}</Body>
      </Card>

      <NavButton href="/" label="홈으로 돌아가기" />
    </Screen>
  );
}
